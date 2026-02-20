import { 
  Flex, 
  Box, 
  Text,
  InputGroup,
  Input, 
  Icon,
  VStack, 
  Button,
  Link,
  Image,
  IconButton,
  HStack,
  Separator
} from "@chakra-ui/react";

import { FaArrowRight, FaInstagram } from "react-icons/fa";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "./ELDR_Logo.png";

export const AdminForgotPass: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

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
        <Flex  w = "80vw" bg = "#F6F6F6" h = "70px" align = "left" px = "2%" py = "1%">
          <Image src={logo} />
        </Flex>  
        <Flex flex="1" w="100%" bg="white">
          <VStack align = "left" width = "50%" px = "5%" gap = {1}>
            <Text fontWeight="bold" fontSize="30px" pt = "15%" pb = "10%">
              Account Confirmation Verification
            </Text>
            
            <Text mb={6} pb = "15%">
              Enter your ELDR account email and we'll send you a link to reset your password.
            </Text>
            
            <Text fontWeight="bold">
              Need help?
            </Text>
            <Text fontWeight="bold">
              Visit our website
            </Text>
            <Link 
              textDecoration="underline"
              color="#3182CE"
              bg="white"
              href="https://eldrcenter.org/"
              pt = "2%"
            >
              Community Counsel Website
            </Link>
            
            <HStack pt = "15%" align = "left" gap = {0}>
              <IconButton 
                boxSize="20px" 
                as={FiFacebook} 
                variant="ghost"
                onClick={() => window.open("https://www.facebook.com/ELDRCenter/photos/")}
              />
              <IconButton 
                boxSize="20px" 
                as={FiLinkedin} 
                variant="ghost"
                onClick={() => window.open("https://www.linkedin.com/company/elderlawanddisabilityrightscenter/")}
              />
              <IconButton 
                boxSize="20px" 
                as={FaInstagram} 
                variant="ghost"
                onClick={() => window.open("https://www.instagram.com/eldr_center/?hl=en")}
              />
              <IconButton 
                boxSize="20px" 
                as={MdOutlineEmail} 
                variant="ghost"
              />
            </HStack>
          </VStack>
          <Separator orientation = "vertical"></Separator>
          <VStack w="50%" bg="#FFFFFF" h="100%" align="left" justify="center" px="5%" py = "10%">
            <Box>
              <Text fontWeight="bold" mb={2}>
                Email
              </Text>
            </Box>
            <InputGroup pb = "3%" w = "30vw" startElement={<MdOutlineEmail />}>
              <Input 
                placeholder="Enter an email"
                height = "40px"
                variant="outline"
                borderColor="#E4E4E7"
                borderWidth="1px"
                borderRadius="md"
                _placeholder={{ color: "#A1A1AA", opacity: 1 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            <Button
              position="relative"
              variant="outline"
              borderRadius="md"
              background={email ? "#3182CE" : "#D4D4D8"}
              w="30vw"
              h="3vw"
              color="white"
              disabled={!email}
              _hover={email ? { bg: "#5797BD" } : {}}
              mb={4}
              onClick={() => navigate("/adminPassReset")}
            >
              Continue
              <Icon
                as={FaArrowRight}
                position="absolute"
                right="16px"
                top="50%"
                transform="translateY(-50%)"
              />
            </Button>
            <Flex align= "center" justify = "center">
              <Text fontSize="sm">
                Go back to{" "}
                <Link 
                  color="#3182CE" 
                  textDecoration="underline"
                  href="/adminLogin"
                >
                  Login Portal
                </Link>
              </Text>
            </Flex>
          </VStack>
        </Flex>
        
        <Flex w="80vw" bg="#F6F6F6" h="70px" />
      </VStack>
    </Flex>
  );
};