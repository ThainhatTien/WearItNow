
import { Permission } from '../../types/User.type';
import { FETCH_PERMISSION_FAILURE, FETCH_PERMISSION_SUCCESS, GET_ALL_PERMISSION } from './PermissionAction';

interface PermissionState {
    permissionData: Permission[];
    error: string | null;
}

const initialState: PermissionState = {
    permissionData: [],
    error: null,
};

const permissionReducer = (state = initialState, action: any): PermissionState => {
    switch (action.type) {
        case GET_ALL_PERMISSION:
            return { ...state, error: null };
        case FETCH_PERMISSION_SUCCESS:
            return { ...state, permissionData: action.payload, error: null };
        case FETCH_PERMISSION_FAILURE:
            return { ...state, permissionData: [], error: action.payload };
        default:
            return state;
    }
};
export default permissionReducer;