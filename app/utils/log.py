# coding:utf-8
import logging

# 蓝图main的日志
logger = logging.getLogger('app_main')

# 设置logger的level为DEBUG
logger.setLevel(logging.DEBUG)

# 创建一个输出日志到控制台的StreamHandler
server_monitor = logging.StreamHandler()
formatter = logging.Formatter('[%(asctime)s] %(name)s:%(levelname)s: %(message)s')
server_monitor.setFormatter(formatter)

# 给logger添加上handler
logger.addHandler(server_monitor)