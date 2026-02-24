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
  IconButton, 
  List,
  Link,
  Image
} from "@chakra-ui/react";

import { useState, useEffect } from "react"
import { FaInstagram, FaArrowRight, FaRegEyeSlash, FaRegEye, FaGoogle, FaMicrosoft } from "react-icons/fa";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlineKey } from "react-icons/hi";

import { useNavigate } from "react-router-dom";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import logo from "./ELDR_Logo.png";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [userFilled, setUserFilled] = useState(false);
  const [passFilled, setPassFilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currUsers, setCurrUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const auth = getAuth();

  const fetchUsers = async () => {
    try{
      const response = await backend.get('/users');
      setCurrUsers(response.data);
    }
    catch (error){
      console.log(error);
    }
  }

  const isAdmin = (email: string, currUsers: string[]) => {
    return currUsers.some(curr => curr.email === email && curr.role === "admin");
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Flex 
      minH="100vh"
      w="100%"
      bg="white"
      align="center"
      justify="center"
      position="relative"
      p="3vh"
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
      <VStack 
        minH="80vh" 
        w="80vw"
        maxW="1200px"
        borderWidth="1px" 
        borderRadius = "sm" 
        borderColor = "#E4E4E7" 
        zIndex={1} 
        gap = {0}
        overflow="hidden"
      >
        <Flex 
          w = "100%" 
          bg = "#F6F6F6" 
          h = "70px" 
          align = "left" 
          px = "2%" 
          py = "1%"
        >
          <Image src = {logo}></Image>
        </Flex>
        <Flex 
          flex="1" 
          w="100%" 
          bg="white"
        >
          <VStack 
            align = "left" 
            width = "50%" 
            px = "5%" 
            gap = {1}
          >
            <Text 
              fontWeight="bold" 
              fontSize="30px" pt = "15%"
            >
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
            <HStack 
              pt = "15%" 
              gap = {0}
            >
              <IconButton 
                boxSize="20px" 
                as = {FiFacebook} 
                variant = "ghost"
                onClick = {() => window.open("https://www.facebook.com/ELDRCenter/photos/")}
                _hover = {{bg: "white"}}
              >
              </IconButton>
              <IconButton 
                boxSize="20px" 
                as = {FiLinkedin} 
                variant = "ghost"
                onClick={() => window.open("https://www.linkedin.com/company/elderlawanddisabilityrightscenter/")}
                _hover = {{bg: "white"}}
                >
              </IconButton>
              <IconButton 
                boxSize="20px" 
                as = {FaInstagram} 
                variant = "ghost"
                onClick = {() => window.open("https://www.instagram.com/eldr_center/?hl=en")}
                _hover = {{bg: "white"}}
              >
              </IconButton>
              <IconButton 
                boxSize="20px" 
                as = {MdOutlineEmail} 
                variant = "ghost"
                _hover = {{bg: "white"}}
              >
              </IconButton>
            </HStack>
          </VStack>
          <Separator orientation = "vertical"></Separator>
          <VStack 
            w="50%" 
            bg="#FFFFFF" 
            h="100%" 
            align="left" 
            justify="center" 
            px = "5%" 
            py = "10%"
          >
            <VStack w="30vw" minW="320px" align="stretch" gap={3}>
              <Box>
                <Text fontWeight="bold">
                  Email
                </Text>
              </Box>
              <Box h="40px">
                <InputGroup
                  width="100%"
                  height="2vw"
                  startElement={<MdOutlineEmail />}
                >
                  <Input
                    placeholder="example@hotmail.com"
                    variant="outline"
                    borderColor="#E4E4E7"
                    borderWidth="1px"
                    borderRadius="md"
                    _placeholder={{ color: "#A1A1AA", opacity: 1 }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserFilled(value.length > 0);
                      setEmail(value);
                    }}
                  />
                </InputGroup>
              </Box>
              <Box>
                <Text fontWeight="bold">
                  Password
                </Text>
              </Box>
              <Box h="40px">
                <InputGroup
                  width="100%"
                  startElement={<HiOutlineKey />}
                  endElement={
                    passFilled ? (
                      <IconButton
                        variant="ghost"
                        boxSize="20px"
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label="Toggle password visibility"
                        _hover={{ bg: "white" }}
                      >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </IconButton>
                    ) : null
                  }
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    height="40px"
                    placeholder="Enter Password"
                    variant="outline"
                    borderColor="#E4E4E7"
                    borderWidth="1px"
                    borderRadius="md"
                    _placeholder={{ color: "A1A1AA", opacity: 1 }}
                    css={{
                      "&::-ms-reveal, &::-ms-clear": {
                        display: "none",
                      },
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassFilled(value.length > 0);
                      setPassword(value);
                    }}
                  />
                </InputGroup>
              </Box>
              <Link
                textDecoration="underline"
                color="#3182CE"
                background="white"
                href="/adminForgotPass"
                alignSelf="flex-end"
                pb="2%"
              >
                Forgot Password?
              </Link>
              <Button
                position="relative"
                variant="outline"
                borderRadius="md"
                background={(userFilled && passFilled) ? "#3182CE" : "#D4D4D8"}
                w="100%"
                h="3vw"
                color="white"
                _hover={{ bg: "#5797BD" }}
                disabled = {!(userFilled && passFilled)}
                onClick={() => {
                  signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                      console.log("Logged in:", userCredential.user.uid);
                      isAdmin(email, currUsers) ? navigate("/adminDashboard") : null; // or wherever
                    })
                    .catch((error) => {
                      console.log("Authentication failed:", error.message);
                    });
                }}
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
            </VStack>
            <VStack
              w="30vw"
              minW="320px"
              align="stretch"
              mt={4}
            >
              <Text 
                fontSize="md" 
                fontWeight="bold" 
                pb="4%"
                textAlign="center"
              >
                or continue with
              </Text>
              <Button variant="outline" 
                bg="#3182CE"
                borderWidth="2px"
                borderRadius="md"
                w="80%"
                alignSelf="center"
                h="50px"
                color = "white"
                _hover = {{bg: "#5797BD"}}
              >
                <Icon
                  as={FaGoogle}
                  position="absolute"
                  left="16px"
                  top="50%"
                  transform="translateY(-50%)"
                />
                Google
              <Icon
                as={FaArrowRight}
                position="absolute"
                right="16px"
                top="50%"
                transform="translateY(-50%)"
              />
              </Button>
              <Button variant="outline" 
                bg="#3182CE"
                borderWidth="2px"
                borderRadius="md"
                w="80%"
                alignSelf="center"
                h="50px"
                color = "white"
                _hover = {{bg: "#5797BD"}}
              >
                <Icon
                  as={FaMicrosoft}
                  position="absolute"
                  left="16px"
                  top="50%"
                  transform="translateY(-50%)"
                />
                Microsoft
                <Icon
                  as={FaArrowRight}
                  position="absolute"
                  right="16px"
                  top="50%"
                  transform="translateY(-50%)"
                />
              </Button>
            </VStack>
          </VStack>
        </Flex>
        <Flex 
          w = "100%" 
          bg = "#F6F6F6" 
          h = "70px"
        >
        </Flex>
      </VStack>
    </Flex>
  );
};
