import React, { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Fade,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ListSkeleton, TableSkeletonBody } from "./CustomSkeleton";
import { Icono } from "@/components/Icono";
import { SortTypeCriteria, ToggleOrden } from "@/types";
import { ArrowDown, ArrowUp } from "lucide-react";
import { CONSTANTS } from "../../../config";

export interface CustomDataTableType {
  title?: string;
  customTitle?: ReactNode;
  error?: boolean;
  loading?: boolean;
  actions?: Array<ReactNode>;
  changeOrderCriteria?: (nuevosCriterios: Array<SortTypeCriteria>) => void;
  columns: Array<SortTypeCriteria>;
  filters?: ReactNode;
  tableContent: Array<Array<ReactNode>>;
  pagination?: ReactNode;
  isSelectable?: boolean;
  inModal?: boolean;
  selected?: (indices: Array<number>) => void;
}

export const CustomDataTable = ({
  title,
  customTitle,
  error = false,
  loading = false,
  inModal = false,
  actions = [],
  columns,
  changeOrderCriteria,
  filters,
  tableContent,
  pagination,
  isSelectable,
  selected,
}: CustomDataTableType) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const [allSelected, setAllSelected] = useState(false);

  const changeAllSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllSelected(event.target.checked);
  };

  const [selectedIndices, setSelectedIndices] = useState<Array<boolean>>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.name);
    setSelectedIndices((prev) => {
      const newState = [...prev];
      newState[index] = event.target.checked;
      return newState;
    });
  };

  useEffect(
    () => {
      if (selected) {
        selected(
          selectedIndices.reduce((resulltado: Array<number>, value, index) => {
            if (value) {
              resulltado.push(index);
            }
            return resulltado;
          }, [])
        );
      }

      if (
        selectedIndices.filter((value) => value).length ==
        selectedIndices.length
      )
        setAllSelected(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(selectedIndices)]
  );

  useEffect(
    () => {
      setSelectedIndices(new Array(tableContent.length).fill(allSelected));
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSelected]
  );

  useEffect(
    () => {
      if (!loading) {
        setSelectedIndices(new Array(tableContent.length).fill(false));
        setAllSelected(false);
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, tableContent.length]
  );

  return (
    <Box sx={{ pb: 2 }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {title ? (
          <Typography variant={"h4"} sx={{ fontWeight: "medium", pl: 1 }}>
            {`${title}`}
          </Typography>
        ) : customTitle ? (
          customTitle
        ) : (
          <Box />
        )}
        <Box>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {isSelectable &&
              selectedIndices.filter((value) => value).length > 0 && (
                <Box sx={{ mx: 1 }}>
                  <Typography key={"contador"} variant={"subtitle2"}>
                    {`${
                      selectedIndices.filter((value) => value).length
                    } seleccionados`}
                  </Typography>
                </Box>
              )}
            {actions.map((accion, index) => (
              <div key={`accion-id-${index}`}>{accion}</div>
            ))}
          </Grid>
        </Box>
      </Grid>
      {/* filtros */}
      <Box
        sx={{
          pt: filters ? 1 : 2,
          pb: filters ? 3 : 1,
        }}
      >
        {filters}
      </Box>
      <Card
        sx={{
          boxShadow: CONSTANTS.boxShadow,
          borderRadius: 2,
          borderColor: theme.palette.divider,
          pt: 0,
          pl: 0,
          pr: 0,
          pb: { sm: 2, md: 2, xl: 2 },
          mb: { sm: 3, md: 3, xl: 3 },
        }}
      >
        {
          <Box>
            {error ? (
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Grid
                          container
                          spacing={0}
                          direction="column"
                          alignItems="center"
                          justifyContent="center"
                          justifyItems={"center"}
                        >
                          <Grid item xs={3} xl={4}>
                            <Typography
                              variant={"body1"}
                              component="h1"
                              noWrap={true}
                              alignItems={"center"}
                            >
                              {`Error obteniendo información`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : tableContent.length == 0 && !loading ? (
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Grid
                          container
                          spacing={0}
                          direction="column"
                          alignItems="center"
                          justifyContent="center"
                          justifyItems={"center"}
                        >
                          <Grid item xs={3} xl={4}>
                            <Typography
                              variant={"body1"}
                              component="h1"
                              noWrap={true}
                              alignItems={"center"}
                            >
                              {`Sin registros`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box>
                {xs ? (
                  loading ? (
                    <ListSkeleton filas={10} />
                  ) : (
                    <div>
                      {tableContent.map((contenidoFila, index) => (
                        <Card
                          sx={{
                            borderRadius: 3,
                            mb: 2,
                          }}
                          key={`row-id-${index}`}
                          variant={"outlined"}
                        >
                          <Card
                            key={`celda-id-${index}`}
                            sx={{
                              borderRadius: 3,
                            }}
                          >
                            <CardContent sx={{ "&:last-child": { pb: 1 } }}>
                              {isSelectable && (
                                <Grid
                                  key={`Grid-id-${index}-seleccionar`}
                                  container
                                  direction="row"
                                  paddingBottom={"0px"}
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography
                                    color="text.secondary"
                                    variant={"subtitle2"}
                                  >
                                    {"Seleccionar"}
                                  </Typography>
                                  {selectedIndices.length > index && (
                                    <Checkbox
                                      checked={selectedIndices[index]}
                                      onChange={handleChange}
                                      name={`${index}`}
                                    />
                                  )}
                                </Grid>
                              )}
                              {contenidoFila.map(
                                (contenido, indexContenido) => (
                                  <Grid
                                    key={`Grid-id-${index}-${indexContenido}`}
                                    container
                                    direction="row"
                                    paddingTop={"5px"}
                                    paddingBottom={"0px"}
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Typography
                                      color="text.secondary"
                                      variant={"subtitle2"}
                                    >
                                      {columns[indexContenido].name}
                                    </Typography>
                                    {contenido}
                                  </Grid>
                                )
                              )}
                            </CardContent>
                          </Card>
                        </Card>
                      ))}
                    </div>
                  )
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            borderBottom: 2,
                            borderColor:
                              theme.palette.mode == "light"
                                ? theme.palette.divider
                                : theme.palette.primary.main,
                          }}
                        >
                          {isSelectable && (
                            <TableCell key={`cabecera-id-seleccionar`}>
                              <Checkbox
                                checked={allSelected}
                                disabled={loading}
                                onChange={changeAllSelected}
                                indeterminate={
                                  selectedIndices.filter((value) => value)
                                    .length != selectedIndices.length &&
                                  selectedIndices.filter((value) => value)
                                    .length > 0
                                }
                              />
                            </TableCell>
                          )}
                          {columns.map((columna, index) => (
                            <TableCell key={`cabecera-id-${index}`}>
                              {columna.sort ? (
                                <Button
                                  disabled={loading}
                                  style={{
                                    minWidth: "0",
                                    padding: "0 1",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  onClick={() => {
                                    const nuevosCriterios = [...columns];

                                    if (changeOrderCriteria) {
                                      changeOrderCriteria(
                                        nuevosCriterios.map(
                                          (value, indice) => ({
                                            ...value,
                                            ...{
                                              orden:
                                                index == indice
                                                  ? ToggleOrden(value.order)
                                                  : undefined,
                                            },
                                          })
                                        )
                                      );
                                    }
                                  }}
                                >
                                  <Typography
                                    variant="h5"
                                    fontWeight={"medium"}
                                    align={"left"}
                                  >
                                    {columna.name}
                                  </Typography>
                                  {columna.order && <Box width={"10px"} />}
                                  {columna.order && (
                                    <Icono fontSize={"inherit"}>
                                      {columna.order == "asc" ? (
                                        <ArrowUp size={15} />
                                      ) : (
                                        <ArrowDown size={15} />
                                      )}
                                    </Icono>
                                  )}
                                </Button>
                              ) : (
                                <Typography
                                  variant="h5"
                                  fontWeight={"medium"}
                                  align={`${
                                    columna.field === "acciones"
                                      ? "right"
                                      : "left"
                                  }`}
                                >
                                  {columna.name}
                                </Typography>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      {loading ? (
                        <TableSkeletonBody
                          filas={10}
                          columnas={columns.length + (isSelectable ? 1 : 0)}
                        />
                      ) : (
                        <TableBody>
                          {tableContent.map(
                            (contenidoFila, indexContenidoTabla) => (
                              <TableRow
                                key={`row-id-${indexContenidoTabla}`}
                                hover={true}
                              >
                                {isSelectable && (
                                  <TableCell
                                    key={`row-id-seleccionar-${indexContenidoTabla}`}
                                  >
                                    <Fade in={!loading} timeout={1000}>
                                      <Box>
                                        {selectedIndices.length >
                                          indexContenidoTabla && (
                                          <Checkbox
                                            checked={
                                              selectedIndices[
                                                indexContenidoTabla
                                              ]
                                            }
                                            onChange={handleChange}
                                            name={`${indexContenidoTabla}`}
                                          />
                                        )}
                                      </Box>
                                    </Fade>
                                  </TableCell>
                                )}
                                {contenidoFila.map(
                                  (contenido, indexContenidoFila) => {
                                    if (inModal) {
                                      return (
                                        <TableCell
                                          key={`celda-id-${indexContenidoTabla}-${indexContenidoFila}`}
                                          sx={{
                                            paddingY: 0,
                                          }}
                                        >
                                          <Fade in={!loading} timeout={1000}>
                                            <Box>{contenido}</Box>
                                          </Fade>
                                        </TableCell>
                                      );
                                    } else {
                                      return (
                                        <TableCell
                                          key={`celda-id-${indexContenidoTabla}-${indexContenidoFila}`}
                                          sx={{
                                            paddingY: 1,
                                          }}
                                        >
                                          <Fade in={!loading} timeout={1000}>
                                            <Box>{contenido}</Box>
                                          </Fade>
                                        </TableCell>
                                      );
                                    }
                                  }
                                )}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                )}
                {pagination}
              </Box>
            )}
          </Box>
        }
      </Card>
    </Box>
  );
};
