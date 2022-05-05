import { isEmpty } from 'lodash';
import { AnyAction } from 'redux';

import * as actions from './AuthActions';

import { IEditorSessionUser } from '../ApiCaller/ApiCaller.d';

export interface IAuthReducerState {
    fetchingSessionData: boolean;
    sessionDataRetrieved: boolean;
    isAuthenticated: boolean;
    user?: IEditorSessionUser;

}

const defaultState: IAuthReducerState = {
    fetchingSessionData: false,
    sessionDataRetrieved: false,
    isAuthenticated: false
}

const AuthReducer = (state=defaultState, action: AnyAction): IAuthReducerState => {
    switch(action.type) {
        case actions.SUCCEED_SESSION_DATA_FETCH: {
            const { user } = action;
            return {
                ...state,
                fetchingSessionData: false,
                sessionDataRetrieved: true,
                isAuthenticated: !isEmpty(user),
                user
            }
        }
        case actions.LOGOUT: {
            return {
                ...state,
                sessionDataRetrieved: true,
                isAuthenticated: false,
                user: undefined
            }
        }
        case actions.START_SESSION_DATA_FETCH: {
            return {
                ...state,
                fetchingSessionData: true
            }
        }
        case actions.FAIL_SESSION_DATA_FETCH: {
            return {
                ...state,
                fetchingSessionData: false
            }
        }


        default: return state;
    }
}

export default AuthReducer;
