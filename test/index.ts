import {test} from 'zora';
import normalize_address_test_suite from './normalize_address';
import stream_test_suite from './stream';

normalize_address_test_suite(test);
stream_test_suite(test);
