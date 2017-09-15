/**
 * 读取/存储 用户信息
 * @auther linzeyong
 */

import { AsyncStorage, } from 'react-native';

export default class User {
    constructor() {
        this.admin_user = 'jingtao_admin_user';
    }

    //获取会员ID
    getUserID = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.admin_user, (error, result) => {
                if(error) {
                    reject(error);
                }else {
                    resolve(result);
                }
            });
        });
    };

    //保存会员ID
    saveUserID = (id) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(this.admin_user, id, (error) => {
                if(error) {
                    reject(error);
                }else {
                    resolve();
                }
            });
        });
    };

    //删除会员/游客ID
    delUserID = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(this.admin_user, (error) => {
                if(error) {
                    reject(error);
                }else {
                    resolve();
                }
            });
        });
    };
}