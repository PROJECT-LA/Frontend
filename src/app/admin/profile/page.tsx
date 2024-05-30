"use client";
import MainCard from "@/components/cards/MainCard";
import {
  Badge,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PlusCircle, PlusIcon, Save, UserCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CONSTANTS } from "../../../../config";
import { useAuthStore } from "@/store";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import {
  RolCRUDType,
  RolType,
  UserRolCRUDType,
} from "../(configuration)/users/types";
import { MessagesInterpreter, delay, siteName } from "@/utils";
import { CustomDialog } from "@/components/modals";
import { ModalProfile, UserInfomation } from "./ui";
import { SendUpdatedInfo, UserCUInformation, UserProfileInfo } from "./types";
import { ChangePassword } from "./ui";

const ProfileClient = () => {
  /* Profile data */
  const [fileList, setFileList] = useState<File[]>([]);
  const fileRemove = () => {
    setFileList([]);
  };

  const [userInfo, setUserInfo] = useState<UserProfileInfo | null>();
  const [rolesData, setRolesData] = useState<RolType[]>([]);
  const { sessionRequest } = useSession();
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const [loading, setLoading] = useState<boolean>(false);
  const [profilePhotoDialog, setProfilePhotoDialog] = useState<boolean>(false);

  const { getPermissions } = useSession();
  const { user } = useAuthStore();
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  /***********************************************************/
  const getRoles = async () => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles`,
      });
      setRolesData(res.data.rows);
    } catch (e) {
      toast.error("Error", { description: MessagesInterpreter(e) });
      throw e;
    } finally {
      setLoading(false);
    }
  };
  const getProfileInfo = async () => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users/${user?.id}`,
      });
      setUserInfo(res);
    } catch (e) {
      toast.error("Error", { description: MessagesInterpreter(e) });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const saveProfileInformation = async (data: UserCUInformation) => {
    const rolesString: string[] = [];
    if (userInfo?.roles) {
      for (const rol of userInfo?.roles) {
        rolesString.push(rol.id);
      }
    }
    const dataSend: SendUpdatedInfo = {
      email: data.email,
      lastNames: data.lastNames,
      names: data.names,
      ci: data.ci,
      phone: data.phone,
      address: data.address,
    };
    try {
      setLoading(true);
      await delay(1000);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users/${user?.id}/update-profile`,
        type: "PATCH",
        body: dataSend,
      });
      toast.success(MessagesInterpreter(res));
      await getProfileInfo();
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  /***********************************************************/

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/profile");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRoles()
      .then(() =>
        getProfileInfo()
          .catch(() => {})
          .finally(() => {})
      )
      .catch(() => {})
      .finally(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openProfileDialog = () => {
    setProfilePhotoDialog(true);
  };

  const acceptProfileDialog = () => {
    setProfilePhotoDialog(false);
  };

  const closeProfileDialog = () => {
    setFileList([]);
    setProfilePhotoDialog(false);
  };
  return (
    <>
      <title>{`Información personal - ${siteName()}`}</title>
      <CustomDialog
        isOpen={profilePhotoDialog}
        handleClose={closeProfileDialog}
        title={"Subir foto de perfil"}
      >
        <ModalProfile
          fileList={fileList}
          setFileList={setFileList}
          fileRemove={fileRemove}
          acceptAction={acceptProfileDialog}
          cancelAction={closeProfileDialog}
        />
      </CustomDialog>

      <Stack spacing={CONSTANTS.gridSpacing} marginBottom={5}>
        <Typography variant="h4">Información personal</Typography>
        <MainCard>
          <Box>
            <Grid container spacing={CONSTANTS.gridSpacing}>
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Card
                    sx={{
                      height: "80%",
                      border: 1,
                      borderColor:
                        theme.palette.mode === "light"
                          ? theme.palette.grey[400]
                          : theme.palette.divider,
                      borderRadius: CONSTANTS.borderRadius,
                    }}
                  >
                    <Stack
                      marginY={`${matchDownMd ? "1rem" : "2.5rem"}`}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box
                        border={1}
                        borderColor={theme.palette.grey[500]}
                        borderRadius="50%"
                        padding={fileList.length === 0 ? 5 : 0}
                      >
                        {fileList.length === 0 ? (
                          <UserCircle2 size="4rem" />
                        ) : (
                          <img
                            style={{
                              width: "150px",
                              borderRadius: "50%",
                              height: "150px",
                            }}
                            src={URL.createObjectURL(fileList[0])}
                          />
                        )}
                      </Box>
                      <Box height={30} />
                      <Button
                        disabled={loading}
                        onClick={openProfileDialog}
                        variant="outlined"
                        startIcon={<PlusCircle size={20} />}
                      >
                        <Typography variant="h5">Subir foto</Typography>
                      </Button>
                    </Stack>
                  </Card>

                  <Box>
                    <Typography variant="subtitle2">Roles</Typography>
                    <Box height={5} />
                    <Stack direction="row" spacing={1}>
                      {userInfo?.roles.map((elem) => (
                        <Chip
                          key={`roles-of-user-each-${elem.id}`}
                          label={elem.name}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={8} marginTop={`${matchDownMd && "2rem"}`}>
                {userInfo !== undefined && userInfo !== null && (
                  <UserInfomation
                    loadingModal={loading}
                    userInfo={userInfo}
                    submitData={saveProfileInformation}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </MainCard>

        <ChangePassword />
      </Stack>
    </>
  );
};

export default ProfileClient;
