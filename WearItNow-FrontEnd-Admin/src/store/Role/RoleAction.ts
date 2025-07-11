import { getAllRoleService } from "services/ApiRole";
import { Role } from "../../types/User.type";

export const GET_ALL_ROLE = 'GET_ALL_ROLE'
export const FETCH_ROLES_FAILURE = 'FETCH_ROLES_FAILURE'
export const FETCH_ROLES_SUCCESS = 'FETCH_ROLES_SUCCESS'
export const POST_PERMISSION_ROLE_REQUEST = 'POST_PERMISSION_ROLE_REQUEST';
export const POST_PERMISSION_ROLE_SUCCESS = 'POST_PERMISSION_ROLE_SUCCESS';
export const POST_PERMISSION_ROLE_FAILURE = 'POST_PERMISSION_ROLE_FAILURE';



export const getAllRole = () => ({
    type: GET_ALL_ROLE,
  });
export const fetchRolesFailure = (error: string) => ({
    type: FETCH_ROLES_FAILURE,
    payload: error,
  });
export const fetchRolesSuccess = (roleData: Role[]) => ({
    type: FETCH_ROLES_SUCCESS,
    payload: roleData,
  }); 
  // Action creators
export const postPermissionRoleRequest = () => ({
  type: POST_PERMISSION_ROLE_REQUEST
});

export const postPermissionRoleSuccess = (rolePermissionData: Role[]) => ({
  type: POST_PERMISSION_ROLE_SUCCESS,
  payload: rolePermissionData
});

export const postPermissionRoleFailure = (error: string) => ({
  type: POST_PERMISSION_ROLE_FAILURE,
  payload: error
});

export const fetchRoles = () => {
  return async (dispatch: any) => {
      try {
          const response = await getAllRoleService(); // Gọi API lấy dữ liệu role
          const roleData = response.data.result;
          dispatch(fetchRolesSuccess(roleData));
      } catch (error) {
          dispatch(fetchRolesFailure('Có lỗi xảy ra khi lấy vai trò.'));
      }
  };
};

  