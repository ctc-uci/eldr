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
  List
} from "@chakra-ui/react";

import { FaArrowRight, FaInstagram } from "react-icons/fa";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const AdminForgotPass: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <VStack minH="100vh">
      <Flex w="100vw" bg="#F6F6F6" h="70px" align="left">
        <Image src="client/src/components/adminProfile/ELDR_Logo.png" />
      </Flex>
      
      <Flex flex="1" w="100%" bg="white" p={4}>
        <VStack align="left" width="50vw" px="5%">
          <Text fontWeight="bold" fontSize="30px">
            Account Confirmation Verification
          </Text>
          
          <List.Root color="black">
            <List.Item>
              Enter your ELDR account email
            </List.Item>
            <List.Item>
              Receive a password reset link
            </List.Item>
            <List.Item>
              Regain access to your CC Staff Account
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
            bg="white"
            href="https://eldrcenter.org/"
          >
            Community Counsel Website
          </Link>
          
          <HStack>
            <IconButton 
              boxSize="20px" 
              as={FiFacebook} 
              variant="ghost"
              onClick={() => navigate("https://www.facebook.com/ELDRCenter/photos/")}
            />
            <IconButton 
              boxSize="20px" 
              as={FiLinkedin} 
              variant="ghost"
              onClick={() => navigate("https://www.linkedin.com/company/elderlawanddisabilityrightscenter/")}
            />
            <IconButton 
              boxSize="20px" 
              as={FaInstagram} 
              variant="ghost"
              onClick={() => navigate("https://www.instagram.com/eldr_center/?hl=en")}
            />
            <IconButton 
              boxSize="20px" 
              as={MdOutlineEmail} 
              variant="ghost"
            />
          </HStack>
        </VStack>

        <VStack w="55%" bg="#FFFFFF" h="100%" align="left" justify="center" px="5%">
          <Box>
            <Text fontWeight="bold" mb={2}>
              Email
            </Text>
          </Box>
          
          <Box w="80%" h="40px" mb={6}>
            <InputGroup startElement={<MdOutlineEmail />}>
              <Input 
                placeholder="Enter an email"
                variant="outline"
                borderColor="#E4E4E7"
                borderWidth="1px"
                borderRadius="md"
                _placeholder={{ color: "#A1A1AA", opacity: 1 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </Box>

          <Button
            position="relative"
            variant="outline"
            borderRadius="md"
            background={email ? "#3182CE" : "#D4D4D8"}
            w="80%"
            h="50px"
            color="white"
            disabled={!email}
            _hover={email ? { bg: "#5797BD" } : {}}
            mb={4}
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

          <Text fontSize="sm" color="gray.600">
            Go back to{" "}
            <Link 
              color="#3182CE" 
              textDecoration="underline"
              href="/adminLogin"
            >
              Login Portal
            </Link>
          </Text>
        </VStack>
      </Flex>
      
      <Flex w="100vw" bg="#F6F6F6" h="70px" />
    </VStack>
  );
};