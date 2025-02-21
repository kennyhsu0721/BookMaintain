import { useState, useEffect, useRef } from "react";
import Book from "./model/Book";
import bookClassData from "./data/book-class-data";
import bookData from "./data/book-data";
import BookSearchArg from './model/BookSearchArg';
import BookGridData from "./model/BookGridData";
import StandardMaintainVM from "./model/StandardMaintainVM";

const BookMaintain = () => {

  // const [vm, setVMValue] = useState(
  //   new MaintainModel(
  //     new BookSearchArg(), [], new Book()));

  const [vm, setVMValue] = useState(
    new StandardMaintainVM(
      BookSearchArg, BookGridData, Book));


  const [filterData, setFilterData] = useState(null);
  //const [pageState, setPageState] = useState("Result");
  
  const [stateOperations,setStateOperations]=useState([]);
  
  const selectedKeyValue = useRef("");
  const pageState=useRef("");
  const states = [
    {
      "StateId": "Browse",
      "StateDescription": "初始",
      "DisplayOperation": [
        "Clear",
        "Filter",
        "Create"
      ]
    },
    {
      "StateId": "Result",
      "StateDescription": "查詢",
      "DisplayOperation": [
        "Clear",
        "Filter",
        "Create"
      ]
    },
    {
      "StateId": "Detial4Create",
      "StateDescription": "新增",
      "DisplayOperation": [
        "Save",
        "BackToPrevious"
      ]
    },
    {
      "StateId": "Detial4Modify",
      "StateDescription": "修改",
      "DisplayOperation": [
        "Save",
        "BackToPrevious",
        "Delete",
        "Create"
      ]
    }
  ];
  const operations = [
    {
      "operationId": "Filter",
      "operationName": "查詢",
      "priority": "910"
    },
    {
      "operationId": "Create",
      "operationName": "新增",
      "priority": "240"
    },
    {
      "operationId": "Save",
      "operationName": "存檔",
      "priority": "210"
    },
    {
      "operationId": "BackToPrevious",
      "operationName": "回上一頁",
      "priority": "200"
    },
    {
      "operationId": "Clear",
      "operationName": "清畫面",
      "priority": "900"
    },
  ]




  /**
   * 處理使用者改變畫面資料
   * @param {*} e 
   */
  const handleVMValueChange = (e) => {
    const value = e.target.value;
    const modelfield = e.target.dataset.field;
    if (pageState.current == "Result") {
      syncVMValue("Filter", value, modelfield);
    }
    if (pageState.pageState == "Detial4Create" || pageState.pageState == "Detial4Modify") {
      syncVMValue("Modify", value, modelfield);
    }

  }

  /**
   * Grid Row 點擊時設定 selectedKeyValue
   * @param {*} e 
   */
  const handleRowClick = (e) => {
    setselectedKeyValue(e.target);
  }


  /**
   * 設定鍵值(Grid 被點選該筆的 Key Value)
   * @param {*} target 
   */
  const setselectedKeyValue = (target) => {
    const selectedRow = target.closest("tr");
    selectedKeyValue.current = selectedRow.querySelector("[data-keyfield]").value;
  }


  /**
   * 更新頁面狀態
   * @param {} operationId 
   * @param {*} data 
   * @param {*} modelfield 
   */
  const syncVMValue = (operationId, data, modelfield) => {

    switch (operationId) {
      case "Create":
        setVMValue((prevvm) => ({
          ...prevvm,
          detialData: data
        }));
      case "Modify":
        if (modelfield != undefined) {
          setVMValue((prevvm) => ({
            ...prevvm,
            detialData: {
              ...prevvm.detialData,
              [modelfield]: data
            }
          }));
        } else {//如果沒有指定欄位就全蓋
          setVMValue((prevvm) => ({
            ...prevvm,
            detialData: data
          }));
        }
        break;
      case "Filter":
        setVMValue((prevvm) => ({
          ...prevvm,
          filterArg: {
            arg: {
              ...prevvm.filterArg.arg,
              [modelfield]: data
            }
          }
        }));
        break;
      case "Grid":

        if (modelfield != undefined) {
          setVMValue((prevvm) => ({
            ...prevvm,
            gridData: {
              ...prevvm.gridData,
              [modelfield]: data
            }
          }));
        } else {
          setVMValue((prevvm) => ({
            ...prevvm,
            gridData: data
          }));
        }
        break;
      default:
        break;
    }
  }

  const setOperation=()=>{
    debugger
    let tempStateOperations=[];
    states.forEach(element => {
        if(element.StateId===pageState.current){
          let tempOperations=element.DisplayOperation;
          tempOperations.forEach(element => {
            tempStateOperations.push(operations.find(m=>m.operationId==element))
          });
        }
    });
    setStateOperations(tempStateOperations);
  }
  const deleteData = () => {

    const showDeleteConfirm = () => {
      return new Promise((resolve, reject) => {
        if (window.confirm("確認刪除")) {
          resolve();
        } else {
          reject();
        }
      })
    }
    const finishDelete = () => {
      return new Promise((resolve, reject) => {
        window.alert("刪除成功");
        resolve();
      })
    }

    const deletePack = async () => {
      try {
        await implBeforeDelete();
        await showDeleteConfirm();
        await implDelete();
        await implAfterDelete();
        await finishDelete()
      } catch (error) {
        console.log(error);
      }
    }
    deletePack();
  }

  const implBeforeDelete = () => {
    return new Promise((resolve, reject) => {
      resolve();
      //reject("Yout Information!!");
    });
  }

  const implDelete = () => {
    return new Promise((resolve, reject) => {
      vm.gridData.rows.splice(
        vm.gridData.rows.findIndex(m => m.bookId == selectedKeyValue.current), 1
      );
      setFilterData([...vm.gridData.rows]);
      syncVMValue("Grid", vm.gridData.rows, "rows");

      resolve();
      //reject("Yout Information!!");
    });
  }

  const implAfterDelete = () => {
    return new Promise((resolve, reject) => {
      resolve();
      //reject("Yout Information!!");
    });
  }

  const initDetail = (operationId) => {

    //點新增時、把selectedKeyValue清空
    if (operationId == "Create") {
      selectedKeyValue.current = "";
    }

    const initDetailPack = async (operationId) => {
      try {
        await implBeforeInitDetail(operationId);
        await implLoadDetailData(operationId);
        await implPreRenderDetail(operationId);
      } catch (error) {
        alert("系統發生錯誤");
      }

    }
    initDetailPack(operationId);
  }

  const implBeforeInitDetail = (operationId) => {
    return new Promise((resolve, reject) => {
      resolve();
      //reject("Yout Information!!");
    });
  }

  const implLoadDetailData = (operationId) => {

    return new Promise((resolve, reject) => {

      //新增畫面預設值
      if (operationId == "Create") {
        const data = new Book();
        data.bookBoughtDate = new Date().toISOString().substring(0, 10);
        data.bookClassId = "internet";
        syncVMValue("Create", data);
      }
      if (operationId == "Modify") {
        const tempBook = vm.gridData.rows.find(m => m.bookId == selectedKeyValue.current);
        const data = new Book();
        data.bookId = selectedKeyValue;
        data.bookName = tempBook.bookName;
        data.bookAuthor = tempBook.bookAuthor;
        data.bookClassId = tempBook.bookClassId;
        data.bookBoughtDate = tempBook.bookBoughtDate;
        data.bookPublisher = tempBook.bookPublisher;
        syncVMValue("Modify", data);
      }
      resolve();
      //reject("Yout Information!!");
    });
  }

  const implPreRenderDetail = (operationId) => {
    return new Promise((resolve, reject) => {
      resolve();
      //reject("Yout Information!!");
    });
  }

  const save = (operationId) => {

    if (pageState.current == "Detial4Create") {
      insertData();
    } else if (pageState.current = "Detial4Modify") {
      updateData();
    }
  }

  const insertData = () => {
    const finishInsertData = () => {
      return new Promise((resolve, reject) => {
        window.alert("新增成功");
        resolve();
      })
    }
    const insertDatalPack = async () => {
      try {
        await implBeforeInsertData();
        await implInsertData();
        await implAfterInsertData();
        await finishInsertData();
      } catch (error) {
        debugger;
        alert("系統發生錯誤");
      }
    }
    insertDatalPack();
  }

  const implBeforeInsertData = () => {
    return new Promise((resolve, reject) => {
      resolve();
      //reject("Yout Information!!");
    })
  }

  const implInsertData = () => {
    return new Promise((resolve, reject) => {

      const temp = [];
      const book = new Book();

      book.bookId = Math.max(...vm.gridData.rows.map(m => m.BookId)) + 1;
      book.bookName = vm.detialData.bookName;
      book.bookAuthor = vm.detialData.bookAuthor;
      book.bookClassId = vm.detialData.bookClassId;
      book.bookClassName = bookClassData.find(m => m.value == vm.detialData.bookClassId).text;
      book.bookBoughtDate = vm.detialData.bookBoughtDate;
      book.bookPublisher = vm.detialData.bookPublisher

      temp.push(book);

      setFilterData([...temp, ...vm.gridData.rows]);
      syncVMValue("Grid", vm.gridData.rows, "rows");

      //新增成功後將畫面清空
      syncVMValue("Default", new Book());

      resolve();
      //reject("Yout Information!!");
    })
  }

  const implAfterInsertData = () => {
    return new Promise((resolve, reject) => {
      resolve();
      //reject("Yout Information!!");
    })
  }

  const onFilter = () => {

    const filterPack = async () => {
      try {
        await implBeforeFilter();
        await implFilter();
        await implAfterFilter();
      } catch (error) {
        alert("系統發生錯誤");
      }
    }
    filterPack();
  }

  const implBeforeFilter = () => {
    return new Promise((resolve, reject) => {
      resolve();
      //reject("Yout Information!!");
    })
  }

  const implFilter = () => {
    return new Promise((resolve, reject) => {
      debugger;
      const searchText = vm.filterArg.arg.bookName;
      const filterResult = vm.gridData.rows.filter(m =>
        m.bookId == searchText ||
        m.bookName.includes(searchText) ||
        m.bookClassName == searchText ||
        m.bookBoughtDate == searchText ||
        m.bookAuthor.includes(searchText) ||
        searchText == ""
      );
      setFilterData(filterResult);
      resolve();
      //reject("Yout Information!!");
    })
  }

  const onPageInit = () => {
    vm.filterArg.arg = new BookSearchArg();

    setOperation();
    let temp = JSON.parse(localStorage.getItem("bookData"));
    
    if (!temp) {
      temp = bookData;
      localStorage.setItem("bookData", JSON.stringify(temp));
    }

    setFilterData(temp);
    vm.gridData.rows = temp;
    syncVMValue("Grid", temp, "rows")

    pageEventHandler(null, "Clear");
  }

  const implAfterFilter = () => {
    return new Promise((resolve, reject) => {
      resolve();
      //reject("Yout Information!!");
    })
  }

  const updateData = () => {

    const finishupdateData = () => {
      return new Promise((resolve, reject) => {
        window.alert("修改成功");
        resolve();
      })
    }

    const updateDataPack = async () => {
      try {
        await implBeforeUpdateData();
        await implUpdateData();
        await implAfterUpdateData();

      } catch (error) {
        alert("系統發生錯誤");
      }
    }
    updateDataPack();
  }

  const implBeforeUpdateData = () => {
    return new Promise((resolve, reject) => {
      resolve();
    })
  }

  const implUpdateData = () => {
    return new Promise((resolve, reject) => {
      const temp = [{
        bookId: vm.detialData.bookId == "" ?
          Math.max(...vm.gridData.rows.map(m => m.BookId)) + 1 :
          vm.detialData.bookId,
        bookName: vm.detialData.bookName,
        bookAuthor: vm.detialData.bookAuthor,
        bookClassId: vm.detialData.bookClassId,
        bookClassName: bookClassData.find(m => m.value == vm.detialData.bookClassId).text,
        bookBoughtDate: vm.detialData.bookBoughtDate,
        bookPublisher: vm.detialData.bookPublisher
      }];

      setFilterData([...temp, ...vm.gridData.rows]);
      syncVMValue("Grid", vm.gridData.rows, "rows");

      //新增成功後將畫面清空
      syncVMValue("Default", new Book());
      //alert("存檔成功");
      resolve();
    })
  }

  const implAfterUpdateData = () => {
    return new Promise((resolve, reject) => {

      resolve();
    })
  }

  const pageEventHandler = (e, operationId) => {
    switch (operationId) {
      case "Create"://新增
        pageState.current="Detial4Create";
        setOperation();
        initDetail(operationId);
        break;
      case "Filter"://查詢
        pageState.current="Result";
        setOperation();
        onFilter();
        break;
      case "Modify"://修改
        pageState.current="Detial4Modify";
        initDetail(operationId);
        setOperation();
        break;
      case "Delete"://刪除
        debugger;
        pageState.current="Result";
        deleteData();
        setOperation();
        break;
      case "Save"://存檔
        pageState.current="Detial4Modify";
        save(operationId);
        setOperation();
        break;
      case "BackToPrevious"://回前頁
        pageState.current="Result";
        setOperation();
        break;
      case "Clear"://清畫面
        pageState.current="Result";
        
        vm.filterArg.arg = new BookSearchArg();
        onFilter();
        setOperation();
        break;
      case "Init"://初始
        onPageInit();
        break;
      default:
        break;
    }
  }

  /**
   * 初始化頁面所需資料
   */
  useEffect(() => {
    //loadBookData();
    onPageInit()
  }, [])


  /**
   * 當 Grid Data 更新時、處理 localStorage
   */
  useEffect(() => {
    localStorage.setItem("bookData", JSON.stringify(vm.gridData.rows));
  }, [vm.gridData]);


  return (
    <div className="container-md">
      <>
        <span>{pageState.current}</span>
        {/* <div>
        {
            (stateOperations).map(element=>{
              return <span>{element}</span>
            })
          }
        </div> */}
        <div className="mb-3">
          {
            (stateOperations).map(element => {
              return <button key={"tr" + element.operationId}
                onClick={(e) => pageEventHandler(e, element.operationId)}
                className="btn btn-outline-primary mx-1">{element.operationName}</button>
            })

          }
          
        </div>
      </>
      {
        pageState.current == "Result" &&
        (
          <>
            {/* <div className="mb-3">
              <button id="btn-show-add-book" className="btn btn-outline-primary mx-1"
                onClick={(e) => pageEventHandler(e, "Create")}>新增</button>
              <button className="btn btn-outline-primary mx-1"
                onClick={(e) => { pageEventHandler(e, "Filter") }}>查詢</button>
            </div> */}
            <div className="mb-3">
              <div className="row">
                <div className="col">
                  <input className="form-control" placeholder="請輸入查詢條件..." data-field="bookName" onChange={handleVMValueChange} value={vm.filterArg.arg.bookName || ""}></input>
                </div>
              </div>
            </div>
            <div id="book_grid" className="mb-3">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <td style={{ textAlign: "center", width: "10%" }}>書籍編號</td>
                    <td style={{ textAlign: "center", width: "35%" }}>書籍名稱</td>
                    <td style={{ textAlign: "center", width: "15%" }}>書籍種類</td>
                    <td style={{ textAlign: "center", width: "15%" }}>作者</td>
                    <td style={{ textAlign: "center" }}>購買日期</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {
                    (filterData != null ? filterData : vm.gridData.rows).map(element => {
                      return (
                        <tr key={"tr" + element.bookId} onClick={handleRowClick}>
                          <td style={{ textAlign: "center" }}>{element.bookId}</td>
                          <td>{element.bookName}</td>
                          <td>{element.bookClassName}</td>
                          <td>{element.bookAuthor}</td>
                          <td style={{ textAlign: "center" }}>{element.bookBoughtDate}</td>
                          <td style={{ textAlign: "center" }}>
                            <a src="#" className="btn btn-outline-primary mx-1" onClick={(e) => pageEventHandler(e, "Modify")}>編輯</a>
                            <a src="#" className="btn btn-outline-primary mx-1" onClick={(e) => pageEventHandler(e, "Delete")}>刪除</a>
                            <input type="hidden" data-keyfield value={element.bookId} readOnly ></input>
                          </td>
                        </tr>);
                    })
                  }
                </tbody>
              </table>
            </div>
          </>
        )
      }
      {
        (pageState.current == "Detial4Create" || pageState.current == "Detial4Modify") &&
        (
          <>
            <h4>
              <span className="badge bg-primary">{pageState.current == "Detial4Create" ? "新增" : "修改"}</span>
            </h4>
            <ul className="fieldlist">
              <li>
                <img className="book-image" src="image/database.jpg" alt="" />
                <input type="hidden" value={vm.detialData.bookId}></input>
              </li>
              <li>
                <label>圖書類別</label>
                <select id="book_class"
                  className="form-select" style={{ width: "100%" }} data-field="bookClassId" onChange={handleVMValueChange}
                  value={vm.detialData.bookClassId || ""} >
                  <option>請選擇</option>
                  {
                    bookClassData.map(element => {
                      return <option key={element.value} value={element.value} >{element.text}</option>
                    })
                  }
                </select>
              </li>
              <li>
                <label>書名</label>
                <input id="book_name" type="text" className="form-control" style={{ width: "100%" }} data-field="bookName" onChange={handleVMValueChange} value={vm.detialData.bookName || ""} />
              </li>
              <li>
                <label>作者</label>
                <input id="book_author" type="text" className="form-control" style={{ width: "100%" }} data-field="bookAuthor" onChange={handleVMValueChange} value={vm.detialData.bookAuthor || ""} />
              </li>
              <li>
                <label>購買日期</label>
                <input id="bought_datepicker" className="form-control" type='date' title="datepicker" style={{ width: "100%" }} data-field="bookBoughtDate" onChange={handleVMValueChange} value={vm.detialData.bookBoughtDate || ""} />
              </li>
              {/* <li className="uk-text-right">
                <button className="btn btn-outline-primary mx-1" onClick={(e) => { pageEventHandler(e, "Save") }}>存檔</button>
                <button className="btn btn-outline-primary mx-1" onClick={(e) => { pageEventHandler(e, "BackToPrevious") }}>回上頁</button>
              </li> */}
            </ul>
          </>
        )
      }

    </div>
  )
}

export default BookMaintain;