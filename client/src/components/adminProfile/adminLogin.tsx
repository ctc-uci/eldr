import { 
  Flex, 
  Box, 
  Text,
  InputGroup,
  Input, 
  Icon,
  VStack, 
  Button, 
  ButtonGroup,
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

const DomainSelect = () => (
  <NativeSelect.Root size="sm" bg = "#F6F6F6" borderColor="#F6F6F6">
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
  // use for conditionally rendering password

  // empty vs filled case
  const [passFilled, setPassFilled] = useState(false);
  // show vs hidden case
  const [showPassword, setShowPassword] = useState(false);
  return (
    <VStack minH="100vh">
      <Flex w = "100vw" bg = "#F6F6F6" h = "70px" align = "left">
        {/* FIX - Image is not rendering at the moment */}
        <Image src = "client/src/components/adminProfile/ELDR_Logo.png"></Image>
      </Flex>
      <Flex flex="1" w="100%" bg="white" p = {4}>
        <VStack align = "left" width = "50vw" px = "5%">
          <Text fontWeight="bold" fontSize="30px">
            Welcome to CC Staff Portal by Community Counsel
          </Text>
          <List.Root color = "black">
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
          <Text fontWeight="bold">
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
          >
            Community Counsel Website
          </Link>
          <HStack>
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


       {/* ELDR Staff Portal */}
      <Separator orientation = "vertical"></Separator>

       <VStack w="55%" bg="#FFFFFF" h="100%" align="left" justify="center" px = "5%">
         <Box>
            <Text fontWeight="bold">
              Email
            </Text>
         </Box>
         <Box w="80%" h="40px">
            <InputGroup startElement={<MdOutlineEmail/>} endElement = {<DomainSelect/>}>
              <Input 
                placeholder="example@"
                variant="outline"
                borderColor="#E4E4E7"
                borderWidth="1px"
                borderRadius="md"
                _placeholder={{ color: "A1A1AA", opacity: 1 }}
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
             pb="8"
             background = "white"
             href="/adminForgotPass"
          >
           Forgot Password?
         </Link>
        
        {/* 
        Proposition - condiitonally render a different button
        based on whether both fields have been filled or not
        (use a useState to keep track of that)
          -> default "grey" button should NOT have hover capability
          -> filled in "blue" version should
        */}
         <Button
            position="relative"
            variant="outline"
            borderRadius="md"
            background="#D4D4D8"
            w="80%"
            h="50px"
            color="white"
            disabled
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

          {/* This will be the button that should render when fields are filled */}
          <Button
            position="relative"
            variant="outline"
            borderRadius="md"
            background="#3182CE"
            w="80%"
            h="50px"
            color="white"
            _hover={{ bg: "#5797BD" }}
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

        <VStack  w="60%" align="center" mt={4} gap={4}>
         <HStack w="60%" gap="4" alignItems = "center">
           <Text fontSize="md" fontWeight="bold">or continue with</Text>
         </HStack>
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
     <Flex w = "100vw" bg = "#F6F6F6" h = "70px"></Flex>
    </VStack>
 );
};
