import Header from "./header";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "./theme";
import { useEffect, useState } from "react";
// import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import {
  cancelAvailibility,
  resetUpdateState,
} from "../../Store/Slices/WorkspaceSlice";
import { fetchDoctorById } from "../../Store/Slices/searchSlice";
import { useParams } from "react-router-dom";
import { getDoctorOffer } from "../../API/offersApi";
import { DoctorOffer } from "../../Store/Slices/offersSlice";
export default function DocOffers() {
  const dispatch = useDispatch();
  const { doctorOffers: rows, loading } = useSelector((state) => state?.offers);

  const { doctorid } = useParams();

  useEffect(() => {
    dispatch(DoctorOffer(doctorid));
  }, [dispatch, doctorid]);
  async function deleteSelected() {
    console.log(selectedRows, rows);
    const data = selectedRows.map((el) => {
      return {
        data: {
          workingDay: rows[el].workingDay,
          startTime: rows[el].startTime,
        },
        id: rows[el].workSpaceId,
      };
    });
    dispatch(cancelAvailibility(data));
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "offerid", headerName: "ID", cellClassName: "name-column--cell" },
    { field: "workspacename", headerName: "Workspace name", flex: 1 },
    { field: "startdate", headerName: "From", flex: 1 },
    {
      field: "enddate",
      headerName: "To",
      flex: 1,
    },
    {
      field: "percentage",
      headerName: "Percentage",
      flex: 1,
    },
    {
      field: "fees",
      headerName: "Fees",
      flex: 1,
    },
  ];
  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectionChange = (selectionModel) => {
    setSelectedRows(selectionModel);
  };
  return (
    <>
      {
        <Box m="20px">
          <Header title="Offers" subtitle="Your all offers" />
          {loading ? (
            <Loader />
          ) : (
            <Box
              m="40px 0 0 0"
              height="75vh"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
                "& .name-column--cell": {
                  color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: colors.blueAccent[700],
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: colors.blueAccent[700],
                },
                "& .MuiCheckbox-root": {
                  color: `${colors.greenAccent[200]} !important`,
                },
              }}
            >
              <DataGrid
                checkboxSelection
                rows={rows?.map((el, i) => ({ ...el, id: i })) || []}
                columns={columns}
                onSelectionModelChange={handleSelectionChange}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2, // Add some margin-top for spacing
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteSelected()}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      }
    </>
  );
}