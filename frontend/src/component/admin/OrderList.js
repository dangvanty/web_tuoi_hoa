import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.scss";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../helper/formatPrice";
const OrderList = () => {
  const dispatch = useDispatch();

  const alert = useAlert();
  const navigate = useNavigate();

  const { error, orders } = useSelector((state) => state.allOrders);

  const { error: deleteError, isDeleted } = useSelector((state) => state.order);

  const deleteOrderHandler = (id) => {
    if(window.confirm('Bạn có chắc muốn xóa đơn hàng này không ?')){
      dispatch(deleteOrder(id));
    }
    
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Xóa đơn hàng thành công");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

  const columns = [
    { field: "id", headerName: "ID Đơn hàng", minWidth: 200, flex: 0.5 },

    {
      field: "status",
      headerName: "Trạng thái",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Đã giao hàng"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Số lượng hàng bán",
      type: "number",
      minWidth: 150,
      flex: 0.4,
    },

    {
      field: "amount",
      headerName: "Tổng tiền",
      type: "number",
      minWidth: 200,
      flex: 0.5,
     
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Sửa/Xóa",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: `${formatNumber(item.totalPrice)} đ` ,
        status: item.orderStatus,
      });
    });

  return (
    <Fragment>
      <MetaData title={`Tất cả đơn hàng - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">Tất cả đơn hàng</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;
