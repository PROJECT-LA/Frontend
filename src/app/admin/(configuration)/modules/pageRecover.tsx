// "use client";
// import { useSession } from "@/hooks/useSession";
// import {
//   GlobalPermissionsProps,
//   PermissionTypes,
//   initialPermissions,
// } from "@/utils/permissions";
// import {
//   Box,
//   Button,
//   Grid,
//   Typography,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import React, { ReactNode, useEffect, useState } from "react";
// import { ModuleCRUDType } from "./types/modulesTypes";
// import { SortEnum, SortTypeCriteria, sortFilter } from "@/types";
// import { Pagination } from "@/components/datatable";
// import { Icono } from "@/components/Icono";
// import { getIconLucide } from "@/types/icons";
// import { CustomMessageState } from "@/components/states";
// import {
//   ActionsButton,
//   IconTooltip,
//   SearchButton,
//   SortButton,
// } from "@/components/buttons";

// import {
//   CirclePlus,
//   List,
//   Menu,
//   Pencil,
//   RotateCw,
//   ToggleLeft,
//   ToggleRight,
// } from "lucide-react";
// import { CONSTANTS } from "../../../../../config";
// import { toast } from "sonner";
// import { MessagesInterpreter, titleCase } from "@/utils";
// import { CustomDataTable } from "@/components/datatable/CustomDataTable";
// import { FilterModules, ModulesModalView } from "./ui";
// import { AlertDialog, CustomDialog } from "@/components/modals";

// const ModulesPage = () => {
//   const [permissions, setPermissions] =
//     useState<PermissionTypes>(initialPermissions);

//   const theme = useTheme();
//   const { sessionRequest, getPermissions } = useSession();

//   const xs = useMediaQuery(theme.breakpoints.only("xs"));
//   const [modulesData, setModulesData] = useState<ModuleCRUDType[]>([]);
//   const [moduleEdition, setModuleEdition] = useState<
//     ModuleCRUDType | undefined | null
//   >();

//   const [sectionsData, setSectionsData] = useState<ModuleCRUDType[]>([]);
//   const [errorModulesData, setErrorModulesData] = useState<any>();
//   const [showAlertModuleState, setShowAlertModuleState] =
//     useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   const [limit, setLimit] = useState<number>(10);
//   const [page, setPage] = useState<number>(1);
//   const [total, setTotal] = useState<number>(0);
//   const [filterSearch, setFilterSearch] = useState<string>("");
//   const [showFilterModule, setShowFilterModule] = useState<boolean>(false);

//   const [modalModule, setModalModule] = useState<{
//     state: boolean;
//     isSection: boolean;
//   }>({
//     isSection: false,
//     state: false,
//   });

//   /*****************************************************/
//   const [orderCriteria, setOrderCriteria] = useState<Array<SortTypeCriteria>>([
//     { field: "order", name: "Orden" },
//     { field: "icon", name: "Icono", sort: true, order: SortEnum.ASC },
//     { field: "name", name: "Nombre", sort: true },
//     { field: "descripcion", name: "Descripción" },
//     { field: "url", name: "URL", sort: true },
//     { field: "estado", name: "Estado", sort: true },
//     { field: "acciones", name: "Acciones" },
//   ]);

//   const paginacion = (
//     <Pagination
//       page={page}
//       limit={limit}
//       total={total}
//       changePage={setPage}
//       changeLimit={setLimit}
//     />
//   );
//   const actions: Array<ReactNode> = [
//     <SearchButton
//       id={"accionFiltrarModuloToggle"}
//       key={"accionFiltrarModuloToggle"}
//       selected={showFilterModule}
//       change={setShowFilterModule}
//     />,
//     xs && (
//       <SortButton
//         id={"ordenarModulos"}
//         key={`ordenarModulos`}
//         label={"Ordenar módulos"}
//         criterios={orderCriteria}
//         cambioCriterios={setOrderCriteria}
//       />
//     ),
//     <IconTooltip
//       id={`ActualizarModulo`}
//       title={"Actualizar"}
//       key={`ActualizarModulo`}
//       action={async () => {
//         await getModulesRequest();
//       }}
//       icon={<RotateCw />}
//       name={"Actualizar lista de parámetros"}
//     />,
//     permissions.create && (
//       <ActionsButton
//         id={"agregarModuloSeccion"}
//         key={"agregarModuloSeccion"}
//         icon={<CirclePlus />}
//         text={"Agregar"}
//         alter={xs ? "icono" : "boton"}
//         label={"Agregar nueva sección o módulo"}
//         actions={[
//           {
//             id: "agregarModulo",
//             show: true,
//             title: "Nuevo módulo",
//             action: () => {
//               addModuleModal(false);
//             },
//             deactivate: false,
//             icon: <Menu />,
//             name: "Nuevo módulo",
//           },
//           {
//             id: "1",
//             show: true,
//             title: "Nueva sección",
//             action: () => {
//               addModuleModal(true);
//             },
//             deactivate: false,
//             icon: <List />,
//             name: "Nueva sección",
//           },
//         ]}
//       />
//     ),
//   ];
//   const contentTable: Array<Array<ReactNode>> = modulesData.map(
//     (moduleData, indexModule) => [
//       <Typography
//         key={`${moduleData.id}-${indexModule}-orden`}
//         variant={"body2"}
//       >
//         {moduleData.order}
//       </Typography>,
//       <Box
//         key={`${moduleData.id}-${indexModule}-nombre`}
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           borderRadius: 1,
//           alignItems: "center",
//         }}
//       >
//         {moduleData.module !== null ? (
//           <Icono sx={{ mr: 1 }} color="inherit">
//             {getIconLucide(moduleData.icon as string)}
//           </Icono>
//         ) : (
//           <CustomMessageState
//             key={`${moduleData.id}-${indexModule}-secion-info`}
//             title={"SECCIÓN"}
//             description={"Es un dato de sección"}
//             color={"info"}
//           />
//         )}
//       </Box>,
//       <Typography
//         key={`${moduleData.id}-${indexModule}-label`}
//         variant={"body2"}
//       >{`${moduleData.title}`}</Typography>,
//       <Typography
//         key={`${moduleData.id}-${indexModule}-descripcion`}
//         variant={"body2"}
//       >{`${moduleData.description ? moduleData.description : ""}`}</Typography>,

//       <Typography key={`${moduleData.id}-${indexModule}-url`} variant={"body2"}>
//         {`${moduleData.url !== null ? moduleData.url : ""}`}
//       </Typography>,
//       <CustomMessageState
//         key={`${moduleData.id}-${indexModule}-estado`}
//         title={moduleData.status}
//         description={moduleData.status}
//         color={
//           moduleData.status == "ACTIVO"
//             ? "success"
//             : moduleData.status == "INACTIVO"
//             ? "error"
//             : "info"
//         }
//       />,
//       <Grid key={`${moduleData.id}-${indexModule}-accion`}>
//         <Grid key={`${moduleData.id}-${indexModule}-acciones`}>
//           {permissions.update && (
//             <IconTooltip
//               id={`cambiarEstadoModulo-${moduleData.id}`}
//               title={moduleData.status == "ACTIVO" ? "Inactivar" : "Activar"}
//               color={moduleData.status == "ACTIVO" ? "success" : "error"}
//               action={() => {
//                 changeStateModuleModal(moduleData, moduleData.module === null);
//               }}
//               deactivate={moduleData.status == "PENDIENTE"}
//               icon={
//                 moduleData.status == "ACTIVO" ? <ToggleRight /> : <ToggleLeft />
//               }
//               name={
//                 moduleData.status == "ACTIVO"
//                   ? "Inactivar Módulo"
//                   : "Activar Módulo"
//               }
//             />
//           )}

//           {permissions.update && (
//             <IconTooltip
//               id={`editarModulo-${moduleData.id}`}
//               title={"Editar"}
//               color={"primary"}
//               action={() => {
//                 editModuleModal(moduleData, moduleData.module === null);
//               }}
//               icon={<Pencil />}
//               name={"Editar módulo"}
//             />
//           )}
//         </Grid>
//       </Grid>,
//     ]
//   );

//   /******************* REQUESTS **********************/
//   const getModulesRequest = async () => {
//     try {
//       setLoading(true);
//       const res = await sessionRequest({
//         url: `${CONSTANTS.baseUrl}/modules`,
//         params: {
//           page,
//           limit,
//           ...(filterSearch.length == 0 ? {} : { filter: filterSearch }),
//           ...(sortFilter(orderCriteria).length == 0
//             ? {}
//             : {
//                 orderRaw: sortFilter(orderCriteria).join(","),
//               }),
//         },
//       });

//       setModulesData(res.data?.rows);
//       setTotal(res.data?.total);
//       setErrorModulesData(null);
//     } catch (e) {
//       setErrorModulesData(e);
//       toast.error(MessagesInterpreter(e));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSectionsRequest = async () => {
//     try {
//       setLoading(true);
//       const res = await sessionRequest({
//         url: `${CONSTANTS.baseUrl}/modules`,
//         params: {
//           section: true,
//         },
//       });
//       setSectionsData(res.data?.rows);
//     } catch (e) {
//       setErrorModulesData(e);
//       toast.error(MessagesInterpreter(e));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changeModuleStateRequest = async (module: ModuleCRUDType) => {
//     try {
//       setLoading(true);
//       const res = await sessionRequest({
//         url: `${CONSTANTS.baseUrl}/modules/${module.id}/status`,
//         type: "patch",
//       });
//       toast.success(MessagesInterpreter(res));
//       await getModulesRequest();
//     } catch (e) {
//       toast.error(MessagesInterpreter(e));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const getPermissionsClient = async () => {
//       const data = await getPermissions("/admin/modules");
//       if (data !== undefined) setPermissions(data);
//     };
//     getPermissionsClient();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     getSectionsRequest().then(() => {
//       getModulesRequest().finally(() => {});
//     });

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     page,
//     limit,
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     JSON.stringify(orderCriteria),
//     filterSearch,
//   ]);

//   useEffect(() => {
//     if (!showFilterModule) {
//       setFilterSearch("");
//     }
//   }, [showFilterModule]);

//   /**************************************************************+ */
//   const addModuleModal = (isSection: boolean) => {
//     setModalModule({
//       state: true,
//       isSection,
//     });
//   };

//   const editModuleModal = (module: ModuleCRUDType, isSection: boolean) => {
//     setModalModule({
//       state: true,
//       isSection,
//     });
//     setModuleEdition(module);
//   };
//   const closeModalModule = async () => {
//     setModalModule({
//       state: false,
//       isSection: false,
//     });
//     setModuleEdition(undefined);
//   };

//   const changeStateModuleModal = async (
//     module: ModuleCRUDType,
//     isSection: boolean
//   ) => {
//     setModuleEdition(module);
//     setShowAlertModuleState(true);
//   };
//   const acceptAlertModuleState = async () => {
//     setShowAlertModuleState(false);
//     if (moduleEdition !== null && moduleEdition !== undefined) {
//       await changeModuleStateRequest(moduleEdition);
//     }
//     setModuleEdition(null);
//   };

//   const cancelAlertModuleState = async () => {
//     setShowAlertModuleState(false);
//     setModuleEdition(null);
//   };

//   return (
//     <>
//       <AlertDialog
//         isOpen={showAlertModuleState}
//         title={"Alerta"}
//         text={`¿Está seguro de ${
//           moduleEdition?.status == "ACTIVO" ? "inactivar" : "activar"
//         } el módulo: ${titleCase(moduleEdition?.title ?? "")} ?`}
//       >
//         <Button onClick={cancelAlertModuleState}>Cancelar</Button>
//         <Button onClick={acceptAlertModuleState}>Aceptar</Button>
//       </AlertDialog>
//       <CustomDialog
//         isOpen={modalModule.state}
//         handleClose={closeModalModule}
//         title={
//           moduleEdition?.id
//             ? modalModule.isSection
//               ? "Editar Sección"
//               : "Editar Módulo"
//             : modalModule?.isSection
//             ? "Nueva Sección"
//             : "Nuevo Módulo"
//         }
//       >
//         <ModulesModalView
//           module={moduleEdition}
//           isSection={modalModule.isSection}
//           correctAction={() => {
//             closeModalModule().finally();
//             getSectionsRequest().then(() => {
//               getModulesRequest().finally();
//             });
//           }}
//           cancelAction={closeModalModule}
//           sections={sectionsData}
//         />
//       </CustomDialog>
//       <CustomDataTable
//         title={"Módulos"}
//         error={!!errorModulesData}
//         loading={loading}
//         actions={actions}
//         columns={orderCriteria}
//         changeOrderCriteria={setOrderCriteria}
//         pagination={paginacion}
//         tableContent={contentTable}
//         filters={
//           showFilterModule && (
//             <FilterModules
//               filterModule={filterSearch}
//               correctAction={(filters) => {
//                 setPage(1);
//                 setLimit(10);
//                 setFilterSearch(filters.search);
//               }}
//               closeAction={() => {}}
//             />
//           )
//         }
//       />
//     </>
//   );
// };

// export default ModulesPage;
