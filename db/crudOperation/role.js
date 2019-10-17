'use strict'
const Role = require('../schema/Role');

const UserCRUD = require('./user');

const { logger } = require('../../utils');

const { createTheRole } = require('../functions/role');
const { constants } = require('../../config');


const {    
    encryptPassword
} = require('../functions/user');

const dbOperations = {
    createSuperAdmin(callback) {
        logger.debug('ROLE_CRUD createsuperadmin');
        const QUERY = {
            'role': 'superadmin'
        };
        const PROJECTION = {
            _id: 1,
            userId: 1
        };
        UserCRUD
            .findUserForThisQuery(QUERY, PROJECTION, function createSuperAdminDbCb1(error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    if (!result) {

                        const superAdminObj = {};

                        superAdminObj.email = constants.SUPER_ADMIN_EMAIL
                        encryptPassword(superAdminObj, "a".repeat(32));
                        superAdminObj.firstName = 'superadmin';
                        superAdminObj.lastName = 'superadmin';
                        superAdminObj.mobile = constants.SUPER_ADMIN_PHONE_NUMBER;
                        superAdminObj.countryCode = constants.SUPER_ADMIN_PHONE_NUMBER_CODE;
                        superAdminObj.role = 'superadmin';

                        UserCRUD
                            .createUser(superAdminObj, function createSuperAdminDbCb2(error1, result1) {
                                if (error1) {
                                    callback(error1, null);
                                }
                                else {
                                    callback(null, result1);
                                }
                            });

                    }
                    else {
                        callback(null, result);
                    }
                }
            });
    },
    getRole(role, callback) {
        logger.debug("ROLE_CRUD getRole");
        const QUERY = {
            "role": role
        };
        const PROJECTIONS = {

        };
        Role
            .findOne(QUERY, PROJECTIONS)
            .exec(function getRoleDbCb(error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(null, result);
                }
            });
    },
    fillRights(roleId, rights, callback) {
        logger.debug('ROLE_CRUD fillRights');
        const QUERY = {
            "roleId": roleId
        };
        const UPDATE_QUERY = {
            "$set": {
                "rights": rights
            }
        };
        Role
            .findOneAndUpdate(QUERY, UPDATE_QUERY)
            .exec(function fillRightsDbCb(error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(null, result);
                }
            });
    },
    createRole(role, callback) {
        logger.debug('ROLE_CRUD createRole');

        const roleObj = createTheRole(role);

        Role
            .create(roleObj, function createRoleDbCb(error, result) {
                if (error) {
                    callback(error);
                }
                else {
                    callback(null, result);
                }
            });
    }
};
module.exports = dbOperations;