/**
 * 读取/存储 搜索记录
 * @auther linzeyong
 * @date   2017.06.16
 */

import { AsyncStorage, } from 'react-native';

export default class SearchData {
    constructor() {
        this.key = 'key_search';
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
    saveDatas = (str) => {
        let that = this;
        let _str = str.replace(/(^\s*)|(\s*$)/g, "");
        return new Promise((resolve, reject) => {
            that.getDatas().then((result) => {
                let datas = result || [];
                let arr = [].concat(_str, datas);
                let set = new Set(arr);
                let newDates = [...set];
                AsyncStorage.setItem(that.key, JSON.stringify(newDates), (err) => {
                    if(err) {
                        reject(err);
                    }else {
                        resolve(newDates);
                    }
                });
            }).catch((error) => {
                console.log(error);
                reject(error);
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