import { message } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { useApp } from '../containers/common/AppContext';
import { handleError } from '../helpers';
import { profileMessages } from '../helpers/translation';
import { useUpdateMemberYouTubeChannelIds } from '../hooks/member';
import LoadingPage from './LoadingPage';
var OAuth2Page = function () {
    var appId = useApp().id;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _a = useAuth(), currentMemberId = _a.currentMemberId, socialLogin = _a.socialLogin;
    var updateYoutubeChannelIds = useUpdateMemberYouTubeChannelIds();
    var params = new URLSearchParams('?' + window.location.hash.replace('#', ''));
    var accessToken = params.get('access_token');
    var state = JSON.parse(params.get('state') || '{}');
    var handleSocialLogin = useCallback(function () {
        socialLogin === null || socialLogin === void 0 ? void 0 : socialLogin({
            appId: appId,
            provider: state.provider,
            providerToken: accessToken,
        }).then(function () { return history.push(state.redirect); }).catch(handleError);
    }, [accessToken, socialLogin, history, state.provider, state.redirect]);
    var handleFetchYoutubeApi = useCallback(function () {
        fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
            headers: {
                Authorization: "Bearer " + accessToken,
                accept: 'application/json',
            },
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
            try {
                var youtubeIds = data.items.map(function (item) { return item.id; });
                updateYoutubeChannelIds({
                    variables: {
                        memberId: currentMemberId,
                        data: youtubeIds,
                    },
                }).then(function () { return history.push(state.redirect); });
            }
            catch (error) {
                message.error(formatMessage(profileMessages.form.message.noYouTubeChannel));
                history.push(state.redirect);
            }
        });
    }, [accessToken, currentMemberId, formatMessage, history, state.redirect, updateYoutubeChannelIds]);
    useEffect(function () {
        if (state.provider === 'google' && currentMemberId) {
            handleFetchYoutubeApi();
        }
    }, [currentMemberId, handleFetchYoutubeApi, state.provider]);
    useEffect(function () {
        if (state.provider && !currentMemberId) {
            handleSocialLogin();
        }
    }, [currentMemberId, handleSocialLogin, state.provider]);
    return React.createElement(LoadingPage, null);
};
export default OAuth2Page;
//# sourceMappingURL=OAuth2Page.js.map