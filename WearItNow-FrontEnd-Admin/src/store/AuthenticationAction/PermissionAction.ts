// PermissionActions.ts

import { getAllPermissionsService } from "services/ApiRole";

export const FETCH_PERMISSION_SUCCESS = 'FETCH_PERMISSION_SUCCESS';
export const FETCH_PERMISSION_FAILURE = 'FETCH_PERMISSION_FAILURE';
export const GET_ALL_PERMISSION = 'GET_ALL_PERMISSION';

export const getAllpermission = () => ({
    type: GET_ALL_PERMISSION,
});

export const fetchPermissionSuccess = (permissions: any) => ({
    type: FETCH_PERMISSION_SUCCESS,
    payload: permissions,
});

export const fetchPermissionFailure = (error: string) => ({
    type: FETCH_PERMISSION_FAILURE,
    payload: error,
});
export const fetchPermissions = () => {
    return async (dispatch: any) => {
        try {
            const response = await getAllPermissionsService(); // Gọi API lấy dữ liệu permissions
            const permissionData = response.data.result;
            dispatch(fetchPermissionSuccess(permissionData));
        } catch (error) {
            dispatch(fetchPermissionFailure('Có lỗi xảy ra khi lấy quyền.'));
        }
    };
};