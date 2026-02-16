import { 
  Flex, 
  Box, 
  Text,
  InputGroup,
  Input, 
  Icon,
  VStack, 
  Button, 
  HStack, 
  Separator,
  NativeSelect,
  IconButton, 
  List,
  Link,
  Image
} from "@chakra-ui/react";

import {
    useState
} from "react"
import { FaInstagram, FaArrowRight, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlineKey } from "react-icons/hi";

import { useNavigate } from "react-router-dom";
import logo from "./ELDR_Logo.png";

const DomainSelect = () => (
  <NativeSelect.Root height = "100%" bg = "#F6F6F6">
    <NativeSelect.Field placeholder = "--">
      <option value="gmail">gmail.com</option>
      <option value="yahoo">yahoo.com</option>
      <option value="rediffmail">rediffmail.com</option>
      <option value = "hotmail">hotmail.com</option>
    </NativeSelect.Field>
    <NativeSelect.Indicator />
  </NativeSelect.Root>
)

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [userFilled, setUserFilled] = useState(false);
  const [passFilled, setPassFilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Flex 
      minH="100vh"
      w="100%"
      bg="white"
      align="center"
      justify="center"
      position="relative"
    >
      <Box
        position="absolute"
        top="-400px"
        left="-400px"
        w="900px"
        h="900px"
        bg="#EFF6FF"
        borderRadius="50%"
        zIndex={0}
      />
      <VStack minH="80vh" borderWidth="1px" borderRadius = "sm" borderColor = "#E4E4E7" zIndex={1} gap = {0}>
        <Flex w = "80vw" bg = "#F6F6F6" h = "70px" align = "left" px = "2%" py = "1%">
          <Image src = {logo}></Image>
        </Flex>
        <Flex flex="1" w="100%" bg="white">
          <VStack align = "left" width = "50%" px = "5%" gap = {1}>
            <Text fontWeight="bold" fontSize="30px" pt = "15%">
              Welcome to CC Staff Portal by Community Counsel
            </Text>
            <List.Root color = "black" pt = "5%">
              <List.Item>
                Manage your CC Staff Account
              </List.Item>
              <List.Item>
                Manage email templates 
              </List.Item>
              <List.Item>
                Create and manage cases through CC Case Catalog 
              </List.Item>
              <List.Item>
                Create and manage events through CC Events Catalog
              </List.Item>
            </List.Root>    
            <Text fontWeight="bold" pt = "30%">
              Need help?
            </Text>
            <Text fontWeight="bold">
              Visit our website
            </Text>
            <Link 
              textDecoration="underline"
              color="#3182CE"
              bg = "white"
              href = "https://eldrcenter.org/"
              pt = "2%"
            >
              Community Counsel Website
            </Link>
            <HStack pt = "15%" gap = {0}>
              <IconButton 
                boxSize="20px" 
                as = {FiFacebook} 
                variant = "ghost"
                onClick = {() => navigate("https://www.facebook.com/ELDRCenter/photos/")}
              >
              </IconButton>
              <IconButton 
                boxSize="20px" 
                as = {FiLinkedin} 
                variant = "ghost"
                onClick={() => navigate("https://www.linkedin.com/company/elderlawanddisabilityrightscenter/")}
                >
              </IconButton>
              <IconButton 
                boxSize="20px" 
                as = {FaInstagram} 
                variant = "ghost"
                onClick = {() => navigate("https://www.instagram.com/eldr_center/?hl=en")}
              >
              </IconButton>
              <IconButton 
                boxSize="20px" 
                as = {MdOutlineEmail} 
                variant = "ghost"
              >
              </IconButton>
            </HStack>
          </VStack>
          <Separator orientation = "vertical"></Separator>
          <VStack w="50%" bg="#FFFFFF" h="100%" align="left" justify="center" px = "5%" py = "10%">
            <Box>
              <Text fontWeight="bold">
                Email
              </Text>
            </Box>
            <Box w="80%" h="40px">
              <InputGroup width = "30vw" height = "2vw" startElement={<MdOutlineEmail/>} endElement = {<DomainSelect/>}>
                <Input 
                  placeholder="example@"
                  variant="outline"
                  borderColor="#E4E4E7"
                  borderWidth="1px"
                  borderRadius="md"
                  _placeholder={{ color: "A1A1AA", opacity: 1 }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserFilled(value.length > 0);
                  }}
                />
              </InputGroup>
            </Box>
          <Box>
            <Text fontWeight="bold">
              Password
            </Text>
          </Box>
          <Box w="80%" h="40px">
            <InputGroup
              width = "30vw"
              startElement={<HiOutlineKey />}
              endElement={
                passFilled ? (
                  <IconButton
                    variant="ghost"
                    boxSize="20px"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </IconButton>
                ) : null
              }
            >
              <Input
                type={showPassword ? "text" : "password"}
                height = "2vw"
                placeholder="Enter Password"
                variant="outline"
                borderColor="#E4E4E7"
                borderWidth="1px"
                borderRadius="md"
                _placeholder={{ color: "A1A1AA", opacity: 1 }}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassFilled(value.length > 0);
                }}
              />
            </InputGroup>
          </Box>
          <Link
            textDecoration="underline"
            color="#3182CE"
            ml="60%"
            background = "white"
            href="/adminForgotPass"
          >
            Forgot Password?
          </Link>
          <Button
            position="relative"
            variant="outline"
            borderRadius="md"
            background={(userFilled && passFilled) ? "#3182CE" : "#D4D4D8"}
            w="30vw"
            h="3vw"
            color="white"
            _hover={{ bg: "#5797BD" }}
            disabled = {!(userFilled && passFilled)}
            onClick={() => navigate("/dashboard")}
          >
            Login
            <Icon
              as={FaArrowRight}
              position="absolute"
              right="16px"
              top="50%"
              transform="translateY(-50%)"
            />
          </Button>
            <VStack  w="100%" align="center" mt={4} >
              <Text fontSize="md" fontWeight="bold" pb="4%">or continue with</Text>
              <Button variant="outline" 
                bg="#3182CE"
                borderWidth="2px"
                borderRadius="md"
                w="60%"
                h="50px"
                color = "white"
                _hover = {{bg: "#5797BD"}}
              >
                Google
              </Button>
              <Button variant="outline" 
                bg="#3182CE"
                borderWidth="2px"
                borderRadius="md"
                w="60%"
                h="50px"
                color = "white"
                _hover = {{bg: "#5797BD"}}
              >
                Microsoft
              </Button>
            </VStack>
          </VStack>
        </Flex>
        <Flex w = "80vw" bg = "#F6F6F6" h = "70px"></Flex>
      </VStack>
    </Flex>
  );
};
