import { Permission, Role } from "../types/User.type"
import axiosInstance from "./api.service"

const GET_API_ROLE = 'roles'
const GET_API_ROLE_PERMISSION = 'permission_roles'
const API_PERMISSION = 'permissions'

export const getAllRoleService  = () => axiosInstance.get(GET_API_ROLE) 


export const postPermission_rolesService = ( name: string, permissions: string[]) => 

    axiosInstance.post(GET_API_ROLE_PERMISSION, { name, permissions });

export const postPermissionService = (permission: Permission) => axiosInstance.post(API_PERMISSION, permission)
export const postRoleService = (role: Role) => axiosInstance.post (GET_API_ROLE, role)
export const getAllPermissionsService  = () => axiosInstance.get(API_PERMISSION) 
