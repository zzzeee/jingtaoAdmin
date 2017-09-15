/**
 * 读取/存储 设备记录
 * @auther linzeyong
 * @date   2017.08.18
 */

import { AsyncStorage, } from 'react-native';

export default class DeviceLog {
    constructor() {
        this.key = 'JTuniqueID';
    }

    //获取数据
    getDatas = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.key, (error, result) => {
                if(error) {
                    reject(error);
                }else {
                    resolve(JSON.parse(result));
                }
            });
        });
    };

    //保存数据
    saveDatas = (unid, version) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(this.key, JSON.stringify({
                uniqueID: unid,
                version: version,
            }), (err) => {
                if(err) {
                    reject(err);
                }else {
                    resolve();
                }
            });
        });
    };

    //删除数据
    delDatas = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(this.key, (error) => {
                if(error) {
                    reject(error);
                }else {
                    resolve();
                }
            });
        });
    };
}