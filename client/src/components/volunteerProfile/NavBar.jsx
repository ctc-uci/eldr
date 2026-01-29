import { React } from "react";

import {
  Box,
  Flex,
  Image,
  Link,
} from "@chakra-ui/react";

import { RxAvatar } from "react-icons/rx";
import logo_eldr from "../profilePage/logo_eldr.png"

export const NavBar = () => {
  return (
    <Flex justify="space-between" align="center" p={4}>
      <Box>
        <Image src={logo_eldr} height="60px"/>
      </Box>
      <Flex align="center" gap={{base: 4, md: 20}}>
        <Link fontWeight="medium">
          Cases
        </Link>
        <Link fontWeight="medium">
          Workshops & Clinics
        </Link>
        <RxAvatar size="50" style={{ marginRight: '20px' }}/>
      </Flex>
    </Flex>
  )
}