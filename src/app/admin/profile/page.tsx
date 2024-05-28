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
import { RolType, UserRolCRUDType } from "../(configuration)/users/types";
import { MessagesInterpreter, siteName } from "@/utils";
import { CustomDialog } from "@/components/modals";
import { ModalProfile, UserInfomation } from "./ui";

const ProfileClient = () => {
  const [userInfo, setUserInfo] = useState<UserRolCRUDType | null>();
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
        url: `${CONSTANTS.baseUrl}/users?limit=30`,
      });
      const dataUsers: UserRolCRUDType[] = res.data.rows;
      const userFind = dataUsers.find((elem) => elem.id === user?.id);
      if (userFind !== undefined) setUserInfo(userFind);
    } catch (e) {
      toast.error("Error", { description: MessagesInterpreter(e) });
      throw e;
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

  const closeProfileDialog = () => {
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
          loadingModal={loading}
          cancelAction={closeProfileDialog}
        />
      </CustomDialog>

      <Stack spacing={CONSTANTS.gridSpacing} marginBottom={5}>
        <Typography variant="h4">Información personal</Typography>
        <MainCard>
          <Box>
            <Grid container spacing={CONSTANTS.gridSpacing}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    border: 1,
                    borderColor:
                      theme.palette.mode === "light"
                        ? theme.palette.grey[400]
                        : theme.palette.divider,
                    borderRadius: CONSTANTS.borderRadius,
                  }}
                >
                  <Stack
                    marginY={`${matchDownMd ? "1rem" : "3rem"}`}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box
                      border={1}
                      borderColor={theme.palette.grey[500]}
                      borderRadius="50%"
                      padding={5}
                    >
                      <UserCircle2 size="4rem" />
                    </Box>
                    <Box height={30} />
                    <Button
                      onClick={openProfileDialog}
                      variant="outlined"
                      startIcon={<PlusCircle size={20} />}
                    >
                      <Typography variant="h5">Subir foto</Typography>
                    </Button>
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={8} marginTop={`${matchDownMd && "2rem"}`}>
                {userInfo !== undefined && userInfo !== null && (
                  <UserInfomation loadingModal={loading} userInfo={userInfo} />
                )}
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      </Stack>
    </>
  );
};

export default ProfileClient;
