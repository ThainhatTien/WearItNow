package com.wearltnow.mapper;

import com.wearltnow.dto.request.discount.DiscountCodeRequest;
import com.wearltnow.dto.response.auth.PermissionResponse;
import com.wearltnow.dto.response.auth.RoleResponse;
import com.wearltnow.dto.response.discount.DiscountCodeResponse;
import com.wearltnow.dto.response.user.UserGroupResponse;
import com.wearltnow.dto.response.user.UserResponse;
import com.wearltnow.model.DiscountCode;
import com.wearltnow.model.Permission;
import com.wearltnow.model.Role;
import com.wearltnow.model.User;
import com.wearltnow.model.UserGroup;
import com.wearltnow.model.enums.DiscountStatus;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T00:42:22+0700",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class DiscountCodeMapperImpl implements DiscountCodeMapper {

    @Override
    public DiscountCode toEntity(DiscountCodeRequest discountCodeRequest) {
        if ( discountCodeRequest == null ) {
            return null;
        }

        DiscountCode.DiscountCodeBuilder discountCode = DiscountCode.builder();

        discountCode.amount( discountCodeRequest.getAmount() );
        discountCode.code( discountCodeRequest.getCode() );
        discountCode.endDate( discountCodeRequest.getEndDate() );
        discountCode.minOrderValue( discountCodeRequest.getMinOrderValue() );
        discountCode.startDate( discountCodeRequest.getStartDate() );
        discountCode.type( discountCodeRequest.getType() );
        discountCode.usageLimit( discountCodeRequest.getUsageLimit() );

        discountCode.status( DiscountStatus.ACTIVE );

        return discountCode.build();
    }

    @Override
    public DiscountCodeResponse toDTO(DiscountCode discountCode) {
        if ( discountCode == null ) {
            return null;
        }

        DiscountCodeResponse.DiscountCodeResponseBuilder discountCodeResponse = DiscountCodeResponse.builder();

        discountCodeResponse.userGroupResponse( userGroupToUserGroupResponse( discountCode.getUserGroup() ) );
        discountCodeResponse.amount( discountCode.getAmount() );
        discountCodeResponse.code( discountCode.getCode() );
        discountCodeResponse.endDate( discountCode.getEndDate() );
        discountCodeResponse.id( discountCode.getId() );
        discountCodeResponse.minOrderValue( discountCode.getMinOrderValue() );
        discountCodeResponse.startDate( discountCode.getStartDate() );
        discountCodeResponse.status( discountCode.getStatus() );
        discountCodeResponse.type( discountCode.getType() );
        discountCodeResponse.usageLimit( discountCode.getUsageLimit() );

        return discountCodeResponse.build();
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

    protected UserResponse userToUserResponse(User user) {
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

    protected List<UserResponse> userListToUserResponseList(List<User> list) {
        if ( list == null ) {
            return null;
        }

        List<UserResponse> list1 = new ArrayList<UserResponse>( list.size() );
        for ( User user : list ) {
            list1.add( userToUserResponse( user ) );
        }

        return list1;
    }

    protected UserGroupResponse userGroupToUserGroupResponse(UserGroup userGroup) {
        if ( userGroup == null ) {
            return null;
        }

        UserGroupResponse userGroupResponse = new UserGroupResponse();

        userGroupResponse.setId( userGroup.getId() );
        userGroupResponse.setName( userGroup.getName() );
        userGroupResponse.setUsers( userListToUserResponseList( userGroup.getUsers() ) );

        return userGroupResponse;
    }
}
