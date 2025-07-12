package com.wearltnow.mapper;

import com.wearltnow.dto.request.auth.RoleRequest;
import com.wearltnow.dto.request.auth.UserRoleRequest;
import com.wearltnow.dto.response.auth.PermissionResponse;
import com.wearltnow.dto.response.auth.RoleResponse;
import com.wearltnow.dto.response.auth.UserRoleResponse;
import com.wearltnow.model.Permission;
import com.wearltnow.model.Role;
import com.wearltnow.model.User;
import com.wearltnow.model.UserRole;
import com.wearltnow.model.UserRoleId;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T00:42:22+0700",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class RoleMapperImpl implements RoleMapper {

    @Override
    public Role toRole(RoleRequest request) {
        if ( request == null ) {
            return null;
        }

        Role role = new Role();

        role.setDescription( request.getDescription() );
        role.setName( request.getName() );

        return role;
    }

    @Override
    public RoleResponse toRoleResponse(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleResponse.RoleResponseBuilder roleResponse = RoleResponse.builder();

        roleResponse.description( role.getDescription() );
        roleResponse.name( role.getName() );
        roleResponse.permissions( permissionSetToPermissionResponseSet( role.getPermissions() ) );

        return roleResponse.build();
    }

    @Override
    public UserRole toUserRole(UserRoleRequest request, User user, Role role) {
        if ( request == null && user == null && role == null ) {
            return null;
        }

        UserRole userRole = new UserRole();

        userRole.setId( userRoleRequestToUserRoleId( request ) );
        userRole.setUser( user );
        userRole.setRole( role );

        return userRole;
    }

    @Override
    public UserRoleResponse toUserRoleResponse(UserRole userRole) {
        if ( userRole == null ) {
            return null;
        }

        UserRoleResponse.UserRoleResponseBuilder userRoleResponse = UserRoleResponse.builder();

        userRoleResponse.userUserId( userRoleUserUserId( userRole ) );
        userRoleResponse.rolesName( userRoleRoleName( userRole ) );

        return userRoleResponse.build();
    }

    protected PermissionResponse permissionToPermissionResponse(Permission permission) {
        if ( permission == null ) {
            return null;
        }

        PermissionResponse.PermissionResponseBuilder permissionResponse = PermissionResponse.builder();

        permissionResponse.description( permission.getDescription() );
        permissionResponse.name( permission.getName() );

        return permissionResponse.build();
    }

    protected Set<PermissionResponse> permissionSetToPermissionResponseSet(Set<Permission> set) {
        if ( set == null ) {
            return null;
        }

        Set<PermissionResponse> set1 = new LinkedHashSet<PermissionResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Permission permission : set ) {
            set1.add( permissionToPermissionResponse( permission ) );
        }

        return set1;
    }

    protected UserRoleId userRoleRequestToUserRoleId(UserRoleRequest userRoleRequest) {
        if ( userRoleRequest == null ) {
            return null;
        }

        UserRoleId userRoleId = new UserRoleId();

        userRoleId.setUserUserId( userRoleRequest.getUserId() );
        userRoleId.setRolesName( userRoleRequest.getName() );

        return userRoleId;
    }

    private Long userRoleUserUserId(UserRole userRole) {
        if ( userRole == null ) {
            return null;
        }
        User user = userRole.getUser();
        if ( user == null ) {
            return null;
        }
        Long userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }

    private String userRoleRoleName(UserRole userRole) {
        if ( userRole == null ) {
            return null;
        }
        Role role = userRole.getRole();
        if ( role == null ) {
            return null;
        }
        String name = role.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
