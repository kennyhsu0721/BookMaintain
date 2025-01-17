class StandardMaintainVM{
    constructor(filterArgType,gridDataType,detialDataType){
        this.status="";
        this.message="";
        this.filterArg={
            pageIndex:0,
            pageSize:15,
            sortField:"",
            sortExpression:"",
            arg:new filterArgType()
        };
        this.gridData={
            rows:[new gridDataType()],
            total: 0,
            keyItems: []
        };
        this.detialData=new detialDataType()
    }
}

export default StandardMaintainVM;