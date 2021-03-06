"""
Copyright (c) 2012-2013 RockStor, Inc. <http://rockstor.com>
This file is part of RockStor.

RockStor is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published
by the Free Software Foundation; either version 2 of the License,
or (at your option) any later version.

RockStor is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
"""


import requests
import time

auth_params = {'apikey': 'adminapikey'}

def api_call(url, data=None, calltype='get', headers=None, save_error=True):
    call = getattr(requests, calltype)
    if (headers is not None):
        r = call(url, verify=False, params=auth_params, data=data,
                 headers=headers)
    else:
        r = call(url, verify=False, params=auth_params, data=data)

    if (r.status_code != 200):
        if (save_error is True):
            cur_time = str(int(time.time()))
            err_file = '/tmp/err-%s.html' % cur_time
            with open(err_file, 'w') as efo:
                for line in r.text.split('\n'):
                    efo.write('%s\n' % line)
            print('Error detail is saved at %s' % err_file)
        r.raise_for_status()

    try:
        ret_val = r.json()
    except ValueError:
        ret_val = {}
    return ret_val

def print_pool_info(pool_info):
    if (pool_info is None):
        print("There are no pools in the system")
        return
    try:
        if ('count' not in pool_info):
            pool_info = [pool_info]
        else:
            pool_info = pool_info['results']
        print("List of pools in the system")
        print("--------------------------------------")
        print("Name\tSize(KB)\tUsage(KB)Raid")
        for p in pool_info:
            print('%s\t%d\t%s\t%s' %
                  (p['name'], p['size'], p['usage'], p['raid']))
    except Exception, e:
        print('Error rendering pool info')

def print_share_info(share_info):
    if (share_info is None):
        print("There are no shares in the system")
        return
    try:
        if ('count' not in share_info):
            share_info = [share_info]
        else:
            share_info = share_info['results']
        print("List of shares in the system")
        print("---------------------------------------")
        print("Name\tSize(KB)\tUsage(KB)\tPool")
        for s in share_info:
            print('%s\t%s\t%s\t%s' %
                  (s['name'], s['size'], s['usage'], s['pool']['name']))
    except Exception, e:
        print('Error rendering share info')

def print_disk_info(disk_info):
    if (disk_info is None):
        print("There are no disks in the system")
        return
    try:
        if ('count' not in disk_info):
            disk_info = [disk_info]
        else:
            disk_info = disk_info['results']
        print("List of disks in the system")
        print("--------------------------------------------")
        print("Name\tSize(KB)\tFree(KB)\tPool")
        for d in disk_info:
            print('%s\t%s\t%s\t%s' %
		  (d['name'], d['size'], d['free'], d['pool']))
    except Exception, e:
        print('Error rendering disk info')


def print_export_info(export_info):
    if (export_info is None):
        print("There are no exports for this share")
    else:
        if (isinstance(export_info, dict)):
            export_info = [export_info]
        print("List of exports for the share")
        print("----------------------------------------")
        print("Id\tMount\tClient\tReadable\tSyncable\tEnabled")
        for e in export_info:
            print('%s\t%s\t%s\t%s\t%s\t%s' %
                  (e['id'], e['mount'], e['host_str'], e['editable'],
                   e['syncable'], e['enabled']))
