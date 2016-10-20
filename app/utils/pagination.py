# coding: utf-8
from flask import current_app


class QueryPagination(object):
    """
    自定义数据分页工具
    """
    def __init__(self, result_list, current_page, length):
        self.result_list = result_list
        self.current_page = current_page
        self.per_page_count = current_app.config['IDPLSS_POSTS_PER_PAGE']
        self.length = length

    def query_pagination(self):
        return self.result_list[(self.current_page-1)*self.per_page_count:((self.current_page-1)*self.per_page_count+self.per_page_count)]

    def has_prev_page(self):
        return ((self.current_page-1)*self.per_page_count+self.per_page_count) > self.per_page_count

    def has_next_page(self):
        count_result_list = self.length
        return ((self.current_page-1)*self.per_page_count+self.per_page_count) < count_result_list
