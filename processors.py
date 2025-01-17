## built-in libraries
import typing
from collections.abc import Callable
from typing import Union

import math
import asyncio
import concurrent.futures
import functools

## third-party libraries
from loguru import logger
from pyppeteer import launch as PyppeteerLaunch

## custom modules
from appconfig import AppConfig
from custom_dataclasses import RekaiText, Paragraph, Line, Clause
from transmutors import Transmute
from db_management import DBM, JishoParseDBM, TextToSpeechDBM, DeepLDBM, GoogleTLDBM
from custom_modules.utilities import ProgressMonitor


class Process:

    @staticmethod
    async def jisho_parse(rekai_text_object: RekaiText):
        logger.info("Starting Jisho processing")
        timestamp = rekai_text_object.timestamp

        list_of_strings_to_transmute = SubProcess.prepare_data(
            rekai_text_object=rekai_text_object,
            db_interface=JishoParseDBM(),
            preprocess=False,
            transmute_paragraphs=False,
            transmute_lines=True,
            transmute_clauses=False)

        if not list_of_strings_to_transmute:
            logger.info('No strings required transmutation. API calls were not made')
            return

        total_transmute_count = len(list_of_strings_to_transmute)
        logger.info(f'Jisho Parse - Number of strings for transmutation: {total_transmute_count}')

        progress_monitor = ProgressMonitor(task_name='Jisho Parse', total_task_count=total_transmute_count)

        _ = await SubProcess.async_webscrape(
            list_of_strings_to_transmute=list_of_strings_to_transmute,
            transmutor=Transmute.parse_string_with_jisho,
            timestamp=timestamp,
            progress_monitor=progress_monitor,
            max_concurrent_coroutines=AppConfig.async_webscrape_semaphore_value)

        logger.success("Finished Jisho processing")

        return

    @staticmethod
    async def gcloud_tts(rekai_text_object: RekaiText):
        logger.info("Starting Google Cloud TTS processing")
        timestamp = rekai_text_object.timestamp

        list_of_strings_to_transmute = SubProcess.prepare_data(
            rekai_text_object=rekai_text_object,
            db_interface=TextToSpeechDBM(),
            preprocess=False,
            transmute_paragraphs=False,
            transmute_lines=True,
            transmute_clauses=False)

        if not list_of_strings_to_transmute:
            logger.info('No strings required transmutation. API calls were not made')
            return

        total_transmute_count = len(list_of_strings_to_transmute)
        logger.info(f'GCloud TTS - Number of strings for transmutation: {total_transmute_count}')

        progress_monitor = ProgressMonitor(task_name='GCloud TTS', total_task_count=total_transmute_count)

        _ = await SubProcess.async_transmute_multithreaded(
            list_of_strings_to_transmute=list_of_strings_to_transmute,
            transmutor=Transmute.tts_string_with_google_api,
            timestamp=timestamp,
            progress_monitor=progress_monitor)

        logger.success("Finished Google Cloud TTS processing")

        return

    @staticmethod
    async def deepl_tl(rekai_text_object: RekaiText):
        """ THIS USES CHUNKED PROCESSING"""

        logger.info("Starting DeepL Translation")
        timestamp = rekai_text_object.timestamp

        list_of_strings_to_transmute = SubProcess.prepare_data(
            rekai_text_object=rekai_text_object,
            db_interface=DeepLDBM(),
            preprocess=rekai_text_object.run_config.use_preprocessed_for_deepl_tl,
            transmute_paragraphs=False,
            transmute_lines=True,
            transmute_clauses=True)

        if not list_of_strings_to_transmute:
            logger.info('No strings required transmutation. API calls were not made')
            return

        total_transmute_count = len(list_of_strings_to_transmute)
        logger.info(f'Deepl TL - Number of strings for transmutation: {total_transmute_count}')
        total_chunk_count = math.ceil((total_transmute_count / AppConfig.deepl_transmutor_chunk_size))
        logger.info(f'Deepl TL - Number of CHUNKS for transmutation: {total_chunk_count}')

        progress_monitor = ProgressMonitor(task_name='Deepl TL', total_task_count=total_chunk_count)

        _ = await SubProcess.async_transmute_chunks_multithreaded(
            list_of_strings_to_transmute=list_of_strings_to_transmute,
            transmutor=Transmute.translate_with_deepl_api,
            timestamp=timestamp,
            progress_monitor=progress_monitor,
            chunk_size=AppConfig.deepl_transmutor_chunk_size)

        logger.success('Finished DeepL Translation')

        return

    @staticmethod
    async def google_tl(rekai_text_object: RekaiText):
        """ THIS USES CHUNKED PROCESSING"""

        logger.info("Starting Google Translation")
        timestamp = rekai_text_object.timestamp

        list_of_strings_to_transmute = SubProcess.prepare_data(
            rekai_text_object=rekai_text_object,
            db_interface=GoogleTLDBM(),
            preprocess=rekai_text_object.run_config.use_preprocessed_for_google_tl,
            transmute_paragraphs=False,
            transmute_lines=True,
            transmute_clauses=True)

        if not list_of_strings_to_transmute:
            logger.info('No strings required transmutation. API calls were not made')
            return

        total_transmute_count = len(list_of_strings_to_transmute)
        logger.info(f'Google TL - Number of strings for transmutation: {total_transmute_count}')
        total_chunk_count = math.ceil((total_transmute_count / AppConfig.google_tl_transmutor_chunk_size))
        logger.info(f'Google TL - Number of CHUNKS for transmutation: {total_chunk_count}')

        progress_monitor = ProgressMonitor(task_name='Google TL', total_task_count=total_chunk_count)

        _ = await SubProcess.async_transmute_chunks_multithreaded(
            list_of_strings_to_transmute=list_of_strings_to_transmute,
            transmutor=Transmute.translate_with_google_tl_api,
            timestamp=timestamp,
            progress_monitor=progress_monitor,
            chunk_size=AppConfig.google_tl_transmutor_chunk_size)

        logger.success('Finished Google Translation')

        return


class SubProcess:

    @staticmethod
    def sync_transmute(
            list_of_strings_to_transmute: list,
            transmutor: Callable[[str, int, ProgressMonitor, int, int], tuple[str, str]],
            timestamp: int,
            progress_monitor: ProgressMonitor) -> None:

        total_string_count = len(list_of_strings_to_transmute)

        list_of_transmuted_data = [transmutor(string, timestamp, progress_monitor, index+1, total_string_count) for
                                   index, string in enumerate(list_of_strings_to_transmute)]


    @staticmethod
    async def async_transmute_multithreaded(
            list_of_strings_to_transmute: list,
            transmutor: Callable[[typing.Union[str, list[str]], int, ProgressMonitor, int, int], tuple[str, str]],
            timestamp: int,
            progress_monitor: ProgressMonitor) -> tuple:

        total_string_count = len(list_of_strings_to_transmute)

        loop = asyncio.get_event_loop()

        async def async_func(transmutor, *args):
            partial_transmutor = functools.partial(transmutor, *args)  # partial functions

            executor = concurrent.futures.ThreadPoolExecutor(
                max_workers=AppConfig.general_multithread_max_workers)  # asyncio can run coroutines with other context managers like executors from concurrent.futures

            return await loop.run_in_executor(executor=executor, func=partial_transmutor)

        tasks = [async_func(transmutor, string, timestamp, progress_monitor, index+1, total_string_count) for
                 index, string in enumerate(list_of_strings_to_transmute)]

        _ = await asyncio.gather(*tasks)

        return _

    @staticmethod
    async def async_webscrape(
            list_of_strings_to_transmute: list,
            transmutor: Callable[[str, int, ProgressMonitor, asyncio.Semaphore, int, int, typing.Union[PyppeteerLaunch, None]], typing.Coroutine[any, any, tuple[str, str]]],
            timestamp: int,
            progress_monitor: ProgressMonitor,
            max_concurrent_coroutines: int) -> tuple:

        semaphore = asyncio.Semaphore(max_concurrent_coroutines)

        total_string_count = len(list_of_strings_to_transmute)

        browser = await PyppeteerLaunch(
            handleSIGINT=False,
            handleSIGTERM=False,
            handleSIGHUP=False)

        logger.info('Async Webscrape: Browser launched')

        tasks = [transmutor(string, timestamp, progress_monitor, semaphore, index+1, total_string_count, browser) for
                 index, string in enumerate(list_of_strings_to_transmute)]

        _ = await asyncio.gather(*tasks)

        await browser.close()

        return _


    @staticmethod
    async def async_transmute_chunks_multithreaded(
            list_of_strings_to_transmute: list,
            transmutor: Callable[[typing.Union[str, list[str]], int, ProgressMonitor, int, int], tuple[str, str]],
            timestamp: int,
            progress_monitor: ProgressMonitor,
            chunk_size: int = AppConfig.default_transmutor_chunk_size) -> tuple:

        total_string_count = len(list_of_strings_to_transmute)

        loop = asyncio.get_event_loop()

        async def async_func(transmutor, *args):
            partial_transmutor = functools.partial(transmutor, *args)  # partial functions

            executor = concurrent.futures.ThreadPoolExecutor(
                max_workers=AppConfig.general_multithread_max_workers)  # asyncio can run coroutines with other context managers like executors from concurrent.futures

            return await loop.run_in_executor(executor=executor, func=partial_transmutor)

        list_of_chunks_to_transmute = [list_of_strings_to_transmute[i:i + chunk_size] for i in range(0, total_string_count, chunk_size)]

        total_chunk_count = len(list_of_chunks_to_transmute)

        tasks = [async_func(transmutor, chunk, timestamp, progress_monitor, index+1, total_chunk_count) for
                 index, chunk in enumerate(list_of_chunks_to_transmute)]

        _ = await asyncio.gather(*tasks)

        return _


    @staticmethod
    def prepare_data(rekai_text_object: RekaiText,
                     db_interface: DBM,
                     preprocess: bool,
                     transmute_paragraphs: bool = False,
                     transmute_lines: bool = True,
                     transmute_clauses: bool = False) -> list[str]:

        dict_of_keystrings_in_db = db_interface.get_dict_of_keystrings_in_db()

        list_of_strings_for_transmutation = []

        # Extract parsable paragraphs in RekaiText Object
        list_of_paragraph_object_tuples: list[
            tuple[int, Paragraph]] = rekai_text_object.numbered_parsable_paragraph_objects

        # Helper function to make loop below clearer
        def append_content(TextObject: Union[Paragraph, Line, Clause]):
            content = TextObject.preprocessed_text if preprocess else TextObject.raw_text
            list_of_strings_for_transmutation.append(content)

        # Conditionals for level of transmutation
        for (_, paragraph) in list_of_paragraph_object_tuples:
            if transmute_paragraphs:
                append_content(paragraph)

            for (_, line) in paragraph.numbered_line_objects:
                if transmute_lines:
                    append_content(line)
                    
                for (_, clause) in line.numbered_clause_objects:
                    if transmute_clauses:
                        append_content(clause)

        # Check if already in database
        list_of_strings_for_transmutation = list(filter(
            lambda string: not string in dict_of_keystrings_in_db,
            list_of_strings_for_transmutation))

        # As single clause lines and single line paragraphs being included can possibly result in duplicates
        list_of_unique_strings_for_transmutation = list(set(list_of_strings_for_transmutation))

        if not all(list_of_unique_strings_for_transmutation):
            return []

        return list_of_unique_strings_for_transmutation


    @staticmethod
    def query_database(key: str, db_interface: DBM, column_name: Union[str, None] = None) -> Union[str, bytes]:
        
        if column_name is None:
            column_name = ""  # Provide a default value for column_name when it is None

        result = db_interface.query(raw_line=key, column_name=column_name)
        return result
