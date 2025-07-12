package com.wearltnow.mapper;

import com.wearltnow.dto.request.user.UserAddressGroupCreationRequest;
import com.wearltnow.dto.request.user.UserAddressGroupUpdationRequest;
import com.wearltnow.dto.response.user.UserAddressGroupResponse;
import com.wearltnow.model.User;
import com.wearltnow.model.UserAddressGroup;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T00:42:22+0700",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class UserAddressGroupMapperImpl implements UserAddressGroupMapper {

    @Override
    public UserAddressGroup toUserAddressGroup(UserAddressGroupCreationRequest userAddressGroupCreationRequest) {
        if ( userAddressGroupCreationRequest == null ) {
            return null;
        }

        UserAddressGroup.UserAddressGroupBuilder userAddressGroup = UserAddressGroup.builder();

        userAddressGroup.user( userAddressGroupCreationRequestToUser( userAddressGroupCreationRequest ) );
        userAddressGroup.toAddress( userAddressGroupCreationRequest.getToAddress() );
        userAddressGroup.toDistrictId( userAddressGroupCreationRequest.getToDistrictId() );
        userAddressGroup.toDistrictName( userAddressGroupCreationRequest.getToDistrictName() );
        userAddressGroup.toName( userAddressGroupCreationRequest.getToName() );
        userAddressGroup.toPhone( userAddressGroupCreationRequest.getToPhone() );
        userAddressGroup.toProvinceId( userAddressGroupCreationRequest.getToProvinceId() );
        userAddressGroup.toProvinceName( userAddressGroupCreationRequest.getToProvinceName() );
        userAddressGroup.toWardCode( userAddressGroupCreationRequest.getToWardCode() );
        userAddressGroup.toWardName( userAddressGroupCreationRequest.getToWardName() );

        return userAddressGroup.build();
    }

    @Override
    public UserAddressGroupResponse toUserAddressGroupResponse(UserAddressGroup userAddressGroup) {
        if ( userAddressGroup == null ) {
            return null;
        }

        UserAddressGroupResponse userAddressGroupResponse = new UserAddressGroupResponse();

        userAddressGroupResponse.setUserId( userAddressGroupUserUserId( userAddressGroup ) );
        userAddressGroupResponse.setId( userAddressGroup.getId() );
        userAddressGroupResponse.setIsActive( userAddressGroup.getIsActive() );
        userAddressGroupResponse.setToAddress( userAddressGroup.getToAddress() );
        userAddressGroupResponse.setToDistrictId( userAddressGroup.getToDistrictId() );
        userAddressGroupResponse.setToDistrictName( userAddressGroup.getToDistrictName() );
        userAddressGroupResponse.setToName( userAddressGroup.getToName() );
        userAddressGroupResponse.setToPhone( userAddressGroup.getToPhone() );
        userAddressGroupResponse.setToProvinceId( userAddressGroup.getToProvinceId() );
        userAddressGroupResponse.setToProvinceName( userAddressGroup.getToProvinceName() );
        userAddressGroupResponse.setToWardCode( userAddressGroup.getToWardCode() );
        userAddressGroupResponse.setToWardName( userAddressGroup.getToWardName() );

        return userAddressGroupResponse;
    }

    @Override
    public List<UserAddressGroupResponse> toUserAddressGroupResponseList(List<UserAddressGroup> userAddressGroups) {
        if ( userAddressGroups == null ) {
            return null;
        }

        List<UserAddressGroupResponse> list = new ArrayList<UserAddressGroupResponse>( userAddressGroups.size() );
        for ( UserAddressGroup userAddressGroup : userAddressGroups ) {
            list.add( toUserAddressGroupResponse( userAddressGroup ) );
        }

        return list;
    }

    @Override
    public void updateUserAddressGroup(UserAddressGroup userAddressGroup, UserAddressGroupUpdationRequest request) {
        if ( request == null ) {
            return;
        }

        if ( userAddressGroup.getUser() == null ) {
            userAddressGroup.setUser( User.builder().build() );
        }
        userAddressGroupUpdationRequestToUser( request, userAddressGroup.getUser() );
        userAddressGroup.setToAddress( request.getToAddress() );
        userAddressGroup.setToDistrictId( request.getToDistrictId() );
        userAddressGroup.setToDistrictName( request.getToDistrictName() );
        userAddressGroup.setToName( request.getToName() );
        userAddressGroup.setToPhone( request.getToPhone() );
        userAddressGroup.setToProvinceId( request.getToProvinceId() );
        userAddressGroup.setToProvinceName( request.getToProvinceName() );
        userAddressGroup.setToWardCode( request.getToWardCode() );
        userAddressGroup.setToWardName( request.getToWardName() );
    }

    protected User userAddressGroupCreationRequestToUser(UserAddressGroupCreationRequest userAddressGroupCreationRequest) {
        if ( userAddressGroupCreationRequest == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.userId( userAddressGroupCreationRequest.getUserId() );

        return user.build();
    }

    private Long userAddressGroupUserUserId(UserAddressGroup userAddressGroup) {
        if ( userAddressGroup == null ) {
            return null;
        }
        User user = userAddressGroup.getUser();
        if ( user == null ) {
            return null;
        }
        Long userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }

    protected void userAddressGroupUpdationRequestToUser(UserAddressGroupUpdationRequest userAddressGroupUpdationRequest, User mappingTarget) {
        if ( userAddressGroupUpdationRequest == null ) {
            return;
        }

        mappingTarget.setUserId( userAddressGroupUpdationRequest.getUserId() );
    }
}
