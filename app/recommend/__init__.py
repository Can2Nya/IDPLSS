# coding: utf-8

from .code_start import code_start_course, code_start_test, code_start_text_resource
from .popular_recommend import popular_text_resource, popular_course, popular_test
from .course_recommend import user_index_calc, course_index_pandas_calc, \
    course_similarity_recommend, user_similarity_recommend
from .resource_recommend import text_resource_index_pandas_calc, \
    text_resources_recommend, user_index_calc, text_resources_user_recommend
from .test_recommend import test_index_pandas_calc, test_user_index_calc, \
    test_similarity_recommend, test_user_similarity_recommend
