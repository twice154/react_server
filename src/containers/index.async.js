import asyncRoute from 'lib/asyncRoute';

export const HeaderContainer = asyncRoute(() => import('containers/HeaderContainer'))
export const Login = asyncRoute(() => import('containers/Login'))
export const Register = asyncRoute(() => import('containers/Register'))
export const StreamingView = asyncRoute(() => import('containers/StreamingView'))
export const SpeedTestContainer = asyncRoute(() => import('containers/SpeedTestContainer'))
export const StreamingListContainer = asyncRoute(() => import('containers/StreamingListContainer'))
export const MoonlightContainer = asyncRoute(() => import('containers/MoonlightContainer'))
export const ChattingContainer = asyncRoute(()=>import('containers/ChattingContainer'))
