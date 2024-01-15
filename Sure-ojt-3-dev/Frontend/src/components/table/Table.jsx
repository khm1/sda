import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import TableCell from './TableCell';
import { useDispatch } from 'react-redux';
import {
  FORM_CURRENT_PAGE_REQUEST,
  FORM_GENERATE_REQUEST,
  FORM_LIST_REQUEST,
} from '../../store/modules/admin';
import { useSelector } from 'react-redux';
import Button from '../Button';
import Input from '../Input';
import CopyButton from './CopyButton';
const Wrapper = styled.div`
  width: fit-content;
  height: fit-content;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  h1 {
    margin-left: 10px;
  }
`;

const BottomFlex = styled.div`
  display: flex;
  gap: 5px;
  width: 500px;
  justify-content: end;
  margin-right: 10px;
  align-items: center;
  h1 {
    color: ${props => props.theme.subColor};
  }
  button {
    background-color: white;
    color: ${props => props.theme.subColor};
  }
  button:hover {
    color: ${props => props.theme.mainColor};
  }

  button:disabled {
    color: gray;
  }
`;

const TableContent = styled.table`
  width: 100%;
  min-width: 800px;
  max-height: 100%;
  min-height: 95%;
  border-spacing: 10px;
  table-layout: fixed;
  border-collapse: collapse;
  text-align: center;
  tr {
    height: 40px;
    max-height: 40px;
  }
  td,
  th {
    padding: 7px;
    height: 40px;
    border: 1px solid #ddd;
    vertical-align: middle;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  td:hover {
    color: ${props => props.theme.subColor};
  }
`;

const TableHead = styled.th`
  background-color: ${props => props.theme.mainColor};
  color: white;
  font-weight: bolder;
`;

const SubmitDiv = styled.div`
  height: 80%;
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-content: center;
  padding-right: 10px;
  button {
    width: 100px;
    min-width: 100px;
  }
`;

const header = ['id', 'urlName', 'received_url', 'generated_url', 'copy'];

export default function Table() {
  const [isInput, setIsInput] = useState(false);
  const [data, setData] = useState([]);
  const [inputData, setInputData] = useState({
    title: '',
    received_url: '',
  });
  const { totalPage, formList, formListDone, currentIndex } = useSelector(
    state => state.admin,
  );

  const dispatch = useDispatch();
  const nextButton = () => {
    dispatch({
      type: FORM_CURRENT_PAGE_REQUEST,
      data: currentIndex + 1,
    });
  };
  const prevButton = () => {
    dispatch({
      type: FORM_CURRENT_PAGE_REQUEST,
      data: currentIndex - 1,
    });
  };

  const addgooglFromURL = () => {
    // google form url 포함한 서버 data 요청, 및 데이터 업데이트 수행
    setIsInput(true);
  };

  const submitNewForm = () => {
    setIsInput(false);
    dispatch({
      type: FORM_GENERATE_REQUEST,
      data: inputData,
    });
  };

  function titleChange(e) {
    setInputData({
      ...inputData,
      title: e.target.value,
    });
  }
  function urlChange(e) {
    setInputData({
      ...inputData,
      received_url: e.target.value,
    });
  }

  function dataProcess(data) {
    if (!data) return;

    let dummyArray = [];
    const udata = data.map((v, i) => {
      return {
        ...v,
        copy: <CopyButton text="복사" value={v.generated_url} />,
      };
    });
    if (data.length !== 10) {
      const dummyDataCount = 10 - data.length;
      const dummyData = {
        num: '',
        title: '',
        originURL: '',
        changeURL: '',
        copy: '',
      };

      dummyArray = new Array(dummyDataCount).fill(dummyData);
    }

    setData([...udata, ...dummyArray]);
  }

  useEffect(() => {
    dispatch({
      type: FORM_LIST_REQUEST,
      data: 1,
    });
  }, []);

  useEffect(() => {
    dataProcess(formList);
  }, [formListDone]);

  function openNewSite(url) {
    window.open(url, '_blank');
  }

  if (!formListDone) return <>로딩중</>;

  return (
    <>
      <Wrapper>
        <Flex>
          <h1>Organigations</h1>
          <SubmitDiv>
            {isInput ? (
              <>
                <Input
                  type="text"
                  placeholder="제목을 입력 해 주세요"
                  onChange={e => titleChange(e)}
                />
                <Input
                  type="text"
                  placeholder="goolgform url을 입력 해 주세요"
                  onChange={e => urlChange(e)}
                />
                <Button onClick={submitNewForm} text="submit" />
              </>
            ) : (
              <Button onClick={addgooglFromURL} text="add" />
            )}
          </SubmitDiv>
        </Flex>
        <TableContent>
          <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '40%' }} />
            <col style={{ width: '40%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr>
              {header
                ? header.map((data, col) => {
                    return <TableHead key={col}>{data}</TableHead>;
                  })
                : null}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {header.map((header, colIndex) => {
                    const tag =
                      header === 'received_url' || header === 'generated_url'
                        ? true
                        : false;

                    return (
                      <TableCell
                        key={colIndex}
                        data={item}
                        columnName={header}
                        isLink={tag}
                        onClick={() => openNewSite(item[header])}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </TableContent>
        <Flex>
          <div></div>
          <BottomFlex>
            <h1>
              {currentIndex}/{totalPage}
            </h1>
            <button onClick={prevButton} disabled={1 === currentIndex}>
              prev
            </button>
            <button onClick={nextButton} disabled={currentIndex === totalPage}>
              next
            </button>
          </BottomFlex>
        </Flex>
      </Wrapper>
    </>
  );
}
