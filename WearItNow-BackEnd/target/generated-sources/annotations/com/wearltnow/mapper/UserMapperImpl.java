package com.wearltnow.mapper;

import com.wearltnow.dto.request.auth.RegisterRequest;
import com.wearltnow.dto.request.user.UserCreationRequest;
import com.wearltnow.dto.request.user.UserUpdateRequest;
import com.wearltnow.dto.response.auth.PermissionResponse;
import com.wearltnow.dto.response.auth.RoleResponse;
import com.wearltnow.dto.response.user.UserResponse;
import com.wearltnow.model.Permission;
import com.wearltnow.model.Role;
import com.wearltnow.model.User;
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
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(UserCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.dob( request.getDob() );
        user.email( request.getEmail() );
        user.firstname( request.getFirstname() );
        user.gender( request.getGender() );
        user.lastname( request.getLastname() );
        user.password( request.getPassword() );
        user.phone( request.getPhone() );
        user.username( request.getUsername() );

        return user.build();
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.dob( user.getDob() );
        userResponse.email( user.getEmail() );
        userResponse.firstname( user.getFirstname() );
        userResponse.gender( user.getGender() );
        userResponse.lastname( user.getLastname() );
        userResponse.phone( user.getPhone() );
        userResponse.roles( roleSetToRoleResponseSet( user.getRoles() ) );
        userResponse.userId( user.getUserId() );
        userResponse.username( user.getUsername() );

        return userResponse.build();
    }

    @Override
    public void updateUser(User user, UserUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        user.setDob( request.getDob() );
        user.setEmail( request.getEmail() );
        user.setFirstname( request.getFirstname() );
        user.setGender( request.getGender() );
        user.setLastname( request.getLastname() );
        user.setPhone( request.getPhone() );
    }

    @Override
    public User toUserRegister(RegisterRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.email( request.getEmail() );
        user.password( request.getPassword() );
        user.username( request.getUsername() );

        return user.build();
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

    protected RoleResponse roleToRoleResponse(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleResponse.RoleResponseBuilder roleResponse = RoleResponse.builder();

        roleResponse.description( role.getDescription() );
        roleResponse.name( role.getName() );
        roleResponse.permissions( permissionSetToPermissionResponseSet( role.getPermissions() ) );

        return roleResponse.build();
    }

    protected Set<RoleResponse> roleSetToRoleResponseSet(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleResponse> set1 = new LinkedHashSet<RoleResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Role role : set ) {
            set1.add( roleToRoleResponse( role ) );
        }

        return set1;
    }
}
