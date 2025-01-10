import { useState, useEffect } from "react";
import Book from "./Book";
import bookClassData from "./data/book-class-data";
import bookData from "./data/book-data";

const BookMaintain = () => {

  const [vm, setInputValue] = useState(new Book());
  const [bookDataFromLocalStorage, setGridData] = useState([]);
  const [filterData,setFilterData]=useState([]);
  
  const [pageState, setPageState] = useState("Query");

  const handleFormValueChange = (e) => {
    const value = e.target.value;
    const modelfield = e.target.dataset.field;

    setInputValue((prevvm) => ({
      ...prevvm,
      [modelfield]: value,
    }));
  }

  const handleShowBookForm = (e) => {
    //setBookFormVisible(!showBookForm);
    setPageState("Insert");
  }

  const handleInsertBook = (e) => {
    const temp = [{
      BookId: Math.max(...bookDataFromLocalStorage.map(m => m.BookId)) + 1,
      BookName: vm.bookName,
      BookAuthor: vm.bookAuthor,
      BookClassId: vm.bookClassId,
      BookClassName: bookClassData.find(m => m.value == vm.bookClassId).text,
      BookBoughtDate: vm.bookBoughtDate,
      BookPublisher: vm.BookPublisher
    }];

    setGridData([...temp, ...bookDataFromLocalStorage]);
    setFilterData([...temp,...bookDataFromLocalStorage]);
    setInputValue(new Book());

    alert("新增成功");
  }

  const handleDelete=(e)=>{
    e.preventDefault();

    if(window.confirm("確認刪除")){
      const bookId=e.target.parentElement.
      previousElementSibling.previousElementSibling.previousElementSibling.
      previousElementSibling.previousElementSibling.innerText;
    
      bookDataFromLocalStorage.splice(
        bookDataFromLocalStorage.findIndex(m=>m.BookId==bookId),1
      )
      setGridData([...bookDataFromLocalStorage]);
      setFilterData([...bookDataFromLocalStorage]);
    }
  }


  const handleFilter=(e)=>{
    e.preventDefault();

    const searchText=e.target.value;

    const filterResult=bookDataFromLocalStorage.filter(m=>
      m.BookId==searchText ||
      m.BookName.includes(searchText) ||
      m.BookClassName==searchText ||
      m.BookBoughtDate==searchText ||
      m.BookAuthor.includes(searchText) ||
      searchText==""
    );
        
      setFilterData(filterResult);

  }

  const loadBookData = () => {
    let temp = JSON.parse(localStorage.getItem("bookData"));

    if (temp == null) {
      temp = bookData;
      localStorage.setItem("bookData", JSON.stringify(temp));
    }
    setFilterData(temp);
    setGridData(temp);
  }

  useEffect(() => {
    loadBookData();
  }, [])

 
  useEffect(() => {
    localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
  }, [bookDataFromLocalStorage]);


  return (
    <div className="container-md">
      {
        pageState == "Insert" &&
        (
          <>
            <ul className="fieldlist">
              <li>
                <img className="book-image" src="image/database.jpg" alt="" />
              </li>
              <li>
                <label>圖書類別</label>
                <select id="book_class" className="form-select" style={{ width: "100%" }} data-field="bookClassId" onChange={handleFormValueChange}
                  value={vm.bookClassId || ""} >
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
                <input id="book_name" type="text" className="form-control" style={{ width: "100%" }} data-field="bookName" onChange={handleFormValueChange} value={vm.bookName || ""} />
              </li>
              <li>
                <label>作者</label>
                <input id="book_author" type="text" className="form-control" style={{ width: "100%" }} data-field="bookAuthor" onChange={handleFormValueChange} value={vm.bookAuthor || ""} />
              </li>
              <li>
                <label>購買日期</label>
                <input id="bought_datepicker" className="form-control" type='date' title="datepicker" style={{ width: "100%" }} data-field="bookBoughtDate" onChange={handleFormValueChange} value={vm.bookBoughtDate || ""} />
              </li>
              <li className="uk-text-right">
                <button className="btn btn-outline-primary" onClick={handleInsertBook}>新增</button>
                <button className="btn btn-outline-primary" onClick={() => { setPageState("Query") }}>取消</button>
              </li>
            </ul>
          </>
        )
      }
      {
        pageState == "Query" &&
        (
          <>
            <div className="mb-3">
              <button id="btn-show-add-book" className="btn btn-outline-primary" onClick={handleShowBookForm}>新增書籍</button>
            </div>
            
            <div id="book_grid" className="mb-3">
              <div className="mb-3">
                <input className="form-control" placeholder="請輸入查詢條件..." onInput={handleFilter}></input>
              </div>

              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <td style={{ textAlign: "center",width:"10%" }}>書籍編號</td>
                    <td style={{ textAlign: "center",width:"35%" }}>書籍名稱</td>
                    <td style={{ textAlign: "center",width:"15%" }}>書籍種類</td>
                    <td style={{ textAlign: "center",width:"15%" }}>作者</td>
                    <td style={{ textAlign: "center" }}>購買日期</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {
                    (filterData.length!=0?filterData:bookDataFromLocalStorage).map(element => {
                      return (
                        <tr key={"tr" + element.BookId}>
                          <td style={{ textAlign: "center" }}>{element.BookId}</td>
                          <td>{element.BookName}</td>
                          <td>{element.BookClassName}</td>
                          <td>{element.BookAuthor}</td>
                          <td style={{ textAlign: "center" }}>{element.BookBoughtDate}</td>
                          <td style={{ textAlign: "center" }}><a src="#" className="btn btn-outline-primary" onClick={handleDelete}>刪除</a></td>
                        </tr>);
                    })
                  }
                </tbody>
              </table>
            </div>
          </>
        )
      }
    </div>
  )
}

export default BookMaintain;