import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HeaderContainer from '../containers/common/HeaderContainer';
import { Card, Upload, Avatar, Tag } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import palette from '../lib/styles/palette';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import { FaBone, FaCommentDots } from 'react-icons/fa';
import getCommaNumber from '../lib/getCommaNumber';
import cn from 'classnames';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Comment from '../components/Comment';
const { Meta } = Card;

const CommuBlock = styled.div`
  background: ${palette.gray[0]};

  .header {
    position: fixed;
    top: 4.5rem;
    left: 0;
    right: 0;
    width: 80rem;
    height: 1rem;
    margin: 0 auto;
    padding: 2rem 8rem;

    .box {
      float: right;
      width: 20rem;
      height: 20rem;

      .top {
        display: flex;
        justify-content: space-between;

        .brief {
          width: 15rem;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .nickname {
            font-size: 1.125rem;
            font-weight: 500;
          }
          .tags {
            font-size: 0.75rem;
            font-weight: 700;
            color: ${palette.gray[6]};

            span + span {
              margin-left: 0.5rem;
            }
          }
        }
      }
      .check-info {
        margin: 0;
        margin-top: 1rem;
        border-top: dashed 0.01rem ${palette.gray[4]};
        padding-top: 1rem;
        color: ${palette.main};
        font-size: 1.125rem;
        font-weight: 500;

        .count {
          font-size: 1.5rem;
          font-weight: 700;
        }
      }
      button {
        margin-top: 1rem;
      }
      .btn-form {
        padding: 0.25rem 1rem;
        background: ${palette.main};
      }
      .btn-check {
        padding: 0.75rem;
        font-size: 1rem;
      }
      .bottom {
        margin-top: 1.5rem;
        color: ${palette.gray[5]};
        font-size: 0.75rem;
        font-weight: 500;

        a {
          color: ${palette.gray[5]};

          &:hover {
            opacity: 0.8;
          }
        }
        div + div {
          margin-top: 0.5rem;
        }
      }
    }
  }
  .wrapper {
    width: 80rem;
    margin: 0 auto;
    padding: 2rem 8rem;

    .cards {
      width: 40rem;

      .ant-card + .ant-card {
        margin-top: 4rem;
      }
      .tag {
        margin-bottom: 1rem;
      }
      .ant-avatar {
        margin-right: 1rem;
      }
      .action-icon {
        padding-top: 0.25rem;
        margin-right: 0.5rem;
      }
      .like {
        animation-duration: 0.5s;
      }
    }
  }
`;

const ModalTemplate = styled.div`
  z-index: 10;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);

  .card-modal {
    width: 56rem;
    min-height: 28rem;
    max-height: 80%;
    display: flex;
    background: white;

    .img-area {
      overflow: hidden;
      width: 60%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: black;

      img {
        width: 100%;
      }
    }
    .card-area {
      width: 40%;

      .ant-card {
        height: 100%;

        .ant-card-body {
          height: 82%;
        }
        .tag {
          margin-bottom: 1rem;
        }
        .ant-avatar {
          margin-right: 1rem;
        }
        .comments {
          overflow: scroll;
          height: 96%;

          .comment {
            font-size: 0.75rem;

            .nickname {
              margin-right: 0.5rem;
              font-weight: 700;
            }
          }
          .comment + .comment {
            margin-top: 0.75rem;
          }
        }
        .comment-form {
          input {
            width: 80%;
            height: 2rem;
            border: none;
          }
        }
      }
    }
  }
  .form-modal {
    width: 36rem;
    padding: 2rem 4rem;
    background: white;

    p {
      text-align: center;
      font-size: 1.25rem;
      font-weight: 500;
    }
    textarea {
      margin-top: 1rem;
      height: 12rem;
      border: none;
      font-size: 1.25rem;

      &::placeholder {
        font-size: 1.5rem;
      }
    }
    .avatar-uploader {
      padding: 2rem 0;
      display: flex;
      justify-content: center;
    }
    .avatar-uploader > .ant-upload {
      width: 100%;
      height: 8rem;
    }
    button {
      margin-top: 1rem;
    }
  }
`;

const Commu = ({ history, location }) => {
  const [clicked, setClicked] = useState(null);
  const [user, setUser] = useState({
    tags: ['태그'],
    profileImage: '',
    nickname: '',
    description: '',
    credit: 0,
  });
  const [cards, setCards] = useState([
    {
      id: 1,
      checked: false,
      nickname: '제니',
      profileImage: '',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
      likes: 107208,
      comments: [
        {
          id: 0,
          nickname: '제니',
          profileImage: '',
          text: '댓글이요~',
        },
      ],
    },
    {
      id: 2,
      checked: false,
      nickname: '김재민',
      profileImage: '',
      image: '',
      likes: 0,
      description: '이거뭐임',
      comments: [
        {
          id: 0,
          nickname: '제니',
          profileImage: '',
          text: '댓글이요~',
        },
      ],
    },
    {
      id: 3,
      checked: true,
      nickname: '제니',
      profileImage: '',
      image: '',
      likes: 9,
      description: '',
      comments: [
        {
          id: 0,
          nickname: '사람',
          profileImage: '',
          text: '댓글이요~',
        },
      ],
    },
  ]);
  const [cardModal, setCardModal] = useState({
    visible: false,
    id: 1,
    checked: false,
    nickname: '제니',
    profileImage: '',
    image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
    likes: 107208,
    description: '셀카한번 올려봤어요',
    comments: [
      {
        id: 0,
        nickname: '사람',
        profileImage: '',
        text: '댓글이요~',
      },
    ],
  });
  const [formModal, setFormModal] = useState({
    visible: false,
    checked: false,
    image: '',
    likes: 0,
    description: '셀카한번 올려봤어요',
  });

  const onClickLike = (e) => {
    e.stopPropagation();
    setClicked(parseInt(e.target.id));
  };
  const onAnimationEnd = (e) => {
    setClicked(null);
  };
  const onClickCard = (e) => {
    console.log(e.currentTarget.id);
    const id = e.currentTarget.id;
    const newCardModel = cards.filter((card) => card.id === parseInt(id))[0];
    setCardModal({
      ...newCardModel,
      visible: true,
    });
  };
  const onClickForm = () => {
    setFormModal({
      ...formModal,
      visible: true,
    });
  };
  const onClose = (e) => {
    setCardModal({
      ...cardModal,
      visible: false,
    });
    setFormModal({
      ...formModal,
      visible: false,
    });
  };
  const onSummit = () => {};

  useEffect(() => {
    if (location.pathname === '/') {
      history.push('/commu');
    }
  }, []);

  useEffect(() => {}, []);

  return (
    <CommuBlock>
      <HeaderContainer />
      <div className="header">
        <div className="box">
          <div className="top">
            <Avatar size={4 * 16} icon={<UserOutlined />} />
            <div className="brief">
              <div className="nickname">유강현</div>
              <div className="tags">
                {user.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Button className="btn-form" onClick={onClickForm}>
            글쓰기
          </Button>
          <p className="check-info">
            이번달은 총 <span className="count">{getCommaNumber(109)}</span>
            분께서 인증하셨습니다!
          </p>
          <Link to="/check">
            <Button className="btn-check" fullWidth>
              나도 인증하기
            </Button>
          </Link>
          <div className="bottom">
            <div>
              <Link to="/about">
                소개 | 도움말 | 홍보센터 | 채용 | 개인정보처리방침 | 약관 | 위치
              </Link>
            </div>
            <div>© 2020 PERPET MATCH from SOFTWARE MAESTRO</div>
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="cards">
          {cards.map((card) => (
            <Card
              hoverable
              key={card.id}
              id={card.id}
              title={
                <div>
                  {card.checked && (
                    <div className="tag">
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        AI 인증글
                      </Tag>
                    </div>
                  )}
                  <Avatar size={2 * 16} icon={<UserOutlined />} />
                  {card.nickname}
                </div>
              }
              cover={card.image && <img alt="card-img" src={card.image} />}
              actions={[
                <div
                  key="like"
                  id={card.id}
                  onClick={onClickLike}
                  onAnimationEnd={onAnimationEnd}
                  className={cn('like animate__animated', {
                    animate__jello: clicked === card.id,
                  })}
                >
                  <FaBone className="action-icon" />
                  좋아요
                </div>,
                <div key="comment">
                  <FaCommentDots className="action-icon" />
                  댓글달기
                </div>,
              ]}
              onClick={onClickCard}
            >
              <Meta
                title={`좋아요 ${card.likes}개`}
                description={card.description}
              />
            </Card>
          ))}
        </div>
      </div>
      {cardModal.visible && (
        <ModalTemplate onClick={onClose}>
          <div
            className="card-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="img-area">
              <img src={cardModal.image} alt="modal-img" />
            </div>
            <div className="card-area">
              <Card
                type="inner"
                title={
                  <div>
                    {cardModal.checked && (
                      <div className="tag">
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          AI 인증글
                        </Tag>
                      </div>
                    )}
                    <Avatar size={2 * 16} icon={<UserOutlined />} />
                    {cardModal.nickname}
                  </div>
                }
                actions={[
                  <div className="comment-form">
                    <Input placeholder="댓글달기..." />
                    게시
                  </div>,
                ]}
              >
                <div className="comments">
                  <div className="comment">
                    <Avatar
                      size={2 * 16}
                      icon={<UserOutlined />}
                      src={cardModal.profileImage}
                    />
                    <span className="nickname">{cardModal.nickname}</span>
                    {cardModal.description}
                  </div>
                  {cardModal.comments.map((comment) => (
                    <div className="comment">
                      <Avatar
                        size={2 * 16}
                        icon={<UserOutlined />}
                        src={comment.profileImage}
                      />
                      <span className="nickname">{comment.nickname}</span>
                      {comment.text}
                    </div>
                  ))}
                </div>
                <Meta title={`좋아요 ${cardModal.likes}개`} />
              </Card>
            </div>
          </div>
        </ModalTemplate>
      )}
      {formModal.visible && (
        <ModalTemplate onClick={onClose}>
          <div
            className="form-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <p>소통글 올리기</p>
            <Textarea placeholder="반려동물과 무슨 일이 있었나요?" />
            <Upload
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              onPreview={() => {}}
            >
              {formModal.image ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: '0.5rem' }}>Upload</div>
                </div>
              )}
            </Upload>
            <Comment>사진을 꼭 넣어주세요!</Comment>
            <Button fullWidth onClick={onSummit}>
              게시
            </Button>
          </div>
        </ModalTemplate>
      )}
    </CommuBlock>
  );
};

export default Commu;
