import empty from "./nodata.png";

function Empty() {
  return (
    <div className="flex items-center justify-center">
      <img src={empty} alt=""/>
    </div>
  );
}

export default Empty;
