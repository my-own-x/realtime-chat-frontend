/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState } from "react";
import {
  toggleLoginModalSelector,
  toggleProfileSettingsModalSelector,
  useGeneralStore,
} from "../stores/generalStore";
import {
  setUserSelector,
  useUserStore,
  userIdSelector,
  userSelector,
} from "../stores/userStore";
import {
  Navbar,
  Center,
  Tooltip,
  UnstyledButton,
  createStyles,
  Stack,
  rem,
} from "@mantine/core";

import {
  IconUser,
  IconLogout,
  IconBrandMessenger,
  IconBrandWechat,
  IconLogin,
} from "@tabler/icons-react";
import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "../graphql/mutations/Logout";
import {
  DEFAULT_ICON_SIZE,
  LOGO_ICON_SIZE,
} from "../shared/constants/constants";

const useStyles = createStyles((theme) => {
  return {
    link: {
      width: rem(50),
      height: rem(50),
      borderRadius: theme.radius.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[7],

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
      },
    },
    active: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  };
});

interface NavbarLinkProps {
  icon: React.FC<unknown>;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip
      label={label}
      position="top-start"
      offset={-30}
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon size={12} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}
const mockdata = [
  {
    icon: () => <IconBrandWechat size={DEFAULT_ICON_SIZE} />,
    label: "Chatrooms",
  },
];

function Sidebar() {
  const toggleProfileSettingsModal = useGeneralStore(
    toggleProfileSettingsModalSelector
  );
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));
  const userId = useUserStore(userIdSelector);
  const user = useUserStore(userSelector);
  const setUser = useUserStore(setUserSelector);
  const toggleLoginModal = useGeneralStore(toggleLoginModalSelector);

  const [
    logoutUser,
    // , { loading, error }
  ] = useMutation(LOGOUT_USER, {
    onCompleted: () => {
      toggleLoginModal();
    },
  });

  const handleLogout = async () => {
    await logoutUser();
    setUser({
      id: undefined,
      fullname: "",
      avatarUrl: null,
      email: "",
    });
  };

  return (
    <Navbar fixed zIndex={100} w={rem(100)} p="md">
      <Center>
        <IconBrandMessenger
          style={{ transform: "translateX(-10px)" }}
          type="mark"
          size={LOGO_ICON_SIZE}
        />
      </Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          {userId && links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          {userId && (
            <NavbarLink
              icon={() => <IconUser size={DEFAULT_ICON_SIZE} />}
              label={"Profile(" + user.fullname + ")"}
              onClick={toggleProfileSettingsModal}
            />
          )}

          {userId ? (
            <NavbarLink
              icon={() => <IconLogout size={DEFAULT_ICON_SIZE} />}
              label="Logout"
              onClick={handleLogout}
            />
          ) : (
            <NavbarLink
              icon={() => <IconLogin size={DEFAULT_ICON_SIZE} />}
              label="Login"
              onClick={toggleLoginModal}
            />
          )}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
