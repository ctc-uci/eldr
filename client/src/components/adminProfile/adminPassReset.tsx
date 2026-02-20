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
  Separator,
  Card,
  CloseButton
} from "@chakra-ui/react";

import { FaArrowRight, FaInstagram, FaRegEyeSlash, FaRegEye, FaLock } from "react-icons/fa";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { HiOutlineKey } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./ELDR_Logo.png"



export const AdminPassReset: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const matching = (newPassword === confirmPassword);

  const Popup = () => (
    <Flex
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg="rgba(0,0,0,0.4)"
      align="center"
      justify="center"
      zIndex={9999}
    >
      <Card.Root
        w="500px"
        p={6}
        borderRadius="md"
        boxShadow="xl"
      >
        <Card.Header p={0}>
          <HStack w="100%" align="center">
            <HStack gap={2}>
              {!matching && <Icon as={FaLock} />}
              
              <Text fontWeight="bold">
                {matching
                  ? "Password Confirmation"
                  : "Password Reset Failed"}
              </Text>
            </HStack>

            <CloseButton
              ml="auto"
              boxSize="20px"
              onClick={() => setShowPopup(false)}
              _hover = {{bg: "white"}}
            />
          </HStack>
        </Card.Header>
        <Card.Body px={1} py={5}>
          <Text>
            {matching
              ? "Your password has been changed. Sign in using your updated credentials."
              : "Please make sure your new password and confirmation entries match."}
          </Text>
        </Card.Body>
        <Card.Footer p={1}>
          <Flex justify="flex-end" w="100%">
            {matching && (
              <Button
                bg="#3182CE"
                color="white"
                onClick={() => {
                  setShowPopup(false);
                  navigate("/adminLogin");
                }}
              >
                Return to Login
              </Button>
            )}
          </Flex>
        </Card.Footer>
      </Card.Root>
    </Flex>
  );

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
      <VStack  minH="80vh"  borderRadius = "sm" borderWidth="1px" borderColor = "#E4E4E7" zIndex={1} gap = {0}>
        <Flex w = "80vw" bg = "#F6F6F6" h = "70px" align = "left" px = "2%" py = "1%">
          <Image src={logo} />
        </Flex>
        
        <Flex flex="1" w="100%" bg="white">
          <VStack align = "left" width = "50%" px = "5%" gap = {1}>
            <Text fontWeight="bold" fontSize="30px" pt = "15%">
              Community Counsel Password Manager
            </Text>
            
            <Text mb={6} pt = "10%">
              Enter your new password below, and confirm where prompted.
            </Text>

            <Text mb={6}>
              Recommended: minimum 8 characters with 1 special character.
            </Text>
            
            <Text fontWeight="bold" pt = "10%">
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
            
            <HStack pt = "15%" align = "left">
              <IconButton 
                boxSize="20px" 
                as={FiFacebook} 
                variant="ghost"
                onClick={() => window.open("https://www.facebook.com/ELDRCenter/photos/")}
                _hover = {{bg: "white"}}
              />
              <IconButton 
                boxSize="20px" 
                as={FiLinkedin} 
                variant="ghost"
                onClick={() => window.open("https://www.linkedin.com/company/elderlawanddisabilityrightscenter/")}
                _hover = {{bg: "white"}}
              />
              <IconButton 
                boxSize="20px" 
                as={FaInstagram} 
                variant="ghost"
                onClick={() => window.open("https://www.instagram.com/eldr_center/?hl=en")}
                _hover = {{bg: "white"}}
              />
              <IconButton 
                boxSize="20px" 
                as={MdOutlineEmail} 
                variant="ghost"
                _hover = {{bg: "white"}}
              />
            </HStack>
          </VStack>
          <Separator orientation = "vertical"></Separator>
          <VStack w="50%" bg="#FFFFFF" h="100%" align="left" justify="center" px = "5%" py = "10%">
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
                      _hover = {{bg: "white"}}
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
                      _hover = {{bg: "white"}}
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
              onClick={() => setShowPopup(true)}
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
            {showPopup && <Popup />}

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
        
        <Flex w = "80vw" bg = "#F6F6F6" h = "70px" />
      </VStack>
    </Flex>
  );
};