import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header';
import { signout } from '../../modules/auth';

const HeaderContainer = () => {
  const { nickname } = useSelector(({ auth }) => ({
    nickname: auth.user.nickname,
  }));
  const dispatch = useDispatch();
  const onSignout = () => {
    localStorage.removeItem('user');
    dispatch(signout());
  };
  return <Header nickname={nickname} onSignout={onSignout} />;
};

export default HeaderContainer;
