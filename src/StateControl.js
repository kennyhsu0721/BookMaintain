const StateControl=({stateOperations,eventHandler})=>{

    return (
        
        <div className="mb-3">
          {
            stateOperations.map(element=>{
                return <button key={"opr" + element.operationId}
                    onClick={(e) => eventHandler(e, element.operationId)}
                    className={"btn mx-1 " + (element.isDisable ? 'btn-outline-primary' : "disabled")}>{element.operationName}</button>
            })
          }
          </div>
    )
}

export default StateControl;