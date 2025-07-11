import { Role } from "../../types/User.type";
import { FETCH_ROLES_FAILURE, FETCH_ROLES_SUCCESS, GET_ALL_ROLE, POST_PERMISSION_ROLE_FAILURE, POST_PERMISSION_ROLE_REQUEST, POST_PERMISSION_ROLE_SUCCESS } from "./RoleAction";



interface RoleState {
    loading: boolean;
    roleData: Role[];
    rolePermissionData: Role[];
    error: string | null
}

const initialState: RoleState = {
    loading: false,
    roleData: [],
    rolePermissionData: [],
    error: null
};

const roleReducer = (state = initialState, action: any): RoleState => {
    switch (action.type) {
        case GET_ALL_ROLE:
            return { ...state, error: null }

        case FETCH_ROLES_FAILURE:
            return { ...state, error: action.payload };

        case FETCH_ROLES_SUCCESS:
            return { ...state, error: null,
                roleData: action.payload};
            
                case POST_PERMISSION_ROLE_REQUEST:
                    return {
                        ...state,
                        loading: true,
                        error: null,
                    };
                case POST_PERMISSION_ROLE_SUCCESS:
                    return {
                        ...state,
                        loading: false,
                        rolePermissionData: action.payload,
                    };
                case POST_PERMISSION_ROLE_FAILURE:
                    return {
                        ...state,
                        loading: false,
                        error: action.payload,
                    };
        default:
            return state;
    }
}

export default roleReducer;