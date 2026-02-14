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
} from "@chakra-ui/react";

import { FaArrowRight, FaInstagram, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { HiOutlineKey } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const AdminPassReset: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <VStack minH="100vh">
      <Flex w="100vw" bg="#F6F6F6" h="70px" align="left">
        <Image src="client/src/components/adminProfile/ELDR_Logo.png" />
      </Flex>
      
      <Flex flex="1" w="100%" bg="white" p={4}>
        <VStack align="left" width="50vw" px="5%">
          <Text fontWeight="bold" fontSize="30px">
            Community Counsel Password Manager
          </Text>
          
          <Text mb={6}>
            Enter your new password below, and confirm where prompted.
          </Text>

          <Text mb={6}>
            Recommended min. 8 characters with 1 special character.
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
              New Password
            </Text>
          </Box>
          
          <Box w="80%" h="40px" mb={6}>
            <InputGroup 
              startElement={<HiOutlineKey />}
              endElement={
                newPassword ? (
                  <IconButton
                    variant="ghost"
                    boxSize="20px"
                    onClick={() => setShowNewPassword(prev => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </IconButton>
                ) : null
              }
            >
              <Input 
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter Password"
                variant="outline"
                borderColor="#E4E4E7"
                borderWidth="1px"
                borderRadius="md"
                _placeholder={{ color: "#A1A1AA", opacity: 1 }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </InputGroup>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>
              Confirm Password
            </Text>
          </Box>
          
          <Box w="80%" h="40px" mb={6}>
            <InputGroup 
              startElement={<HiOutlineKey />}
              endElement={
                confirmPassword ? (
                  <IconButton
                    variant="ghost"
                    boxSize="20px"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </IconButton>
                ) : null
              }
            >
              <Input 
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter Password"
                variant="outline"
                borderColor="#E4E4E7"
                borderWidth="1px"
                borderRadius="md"
                _placeholder={{ color: "#A1A1AA", opacity: 1 }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </InputGroup>
          </Box>

          <Button
            position="relative"
            variant="outline"
            borderRadius="md"
            background={newPassword && confirmPassword ? "#3182CE" : "#D4D4D8"}
            w="80%"
            h="50px"
            color="white"
            disabled={!newPassword || !confirmPassword}
            _hover={newPassword && confirmPassword ? { bg: "#5797BD" } : {}}
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