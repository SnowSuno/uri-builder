import {
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { CopyIcon, CheckIcon, AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { produce } from "immer";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

type Param = { key: string; value: string };
const isNotBlank = (value: string) => value.length > 0;

const parseUri = (uriString: string) => {
  try {
    const url = new URL(uriString);

    return {
      base: uriString.split("?")[0],
      params: [...url.searchParams.entries()].map(([key, value]) => ({
        key,
        value,
      })),
    };
  } catch {
    return null;
  }
};

function App() {
  const [uriString, setUriString] = useQueryParam(
    "uri",
    withDefault(StringParam, "supertoss://main?referrer=test"),
  );

  const [uriBase, setUriBase] = useState(parseUri(uriString)?.base ?? "");
  const [params, setParams] = useState<Param[]>(
    parseUri(uriString)?.params ?? [],
  );

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [uriString]);

  const addParam = () =>
    setParams((params) => [...params, { key: "", value: "" }]);

  const updateParams = (index: number, type: keyof Param) => (value: string) =>
    setParams((params) =>
      produce(params, (draftParams) => {
        draftParams[index][type] = value;
      }),
    );

  const removeParam = (index: number) =>
    setParams((params) => params.filter((_, i) => i !== index));

  const searchParams = useMemo(
    () =>
      new URLSearchParams(
        params
          .map((p) => [p.key, p.value])
          .filter((entry) => entry.every(isNotBlank)),
      ).toString(),
    [params],
  );

  useEffect(() => {
    setUriString(
      uriBase + (isNotBlank(searchParams) ? `?${searchParams}` : ""),
    );
  }, [uriBase, setUriBase, searchParams]);

  const onChangeUri = useCallback((uriString: string) => {
    setUriString(uriString);

    const uri = parseUri(uriString);

    if (!uri) {
      return;
    }

    setUriBase(uri.base);
    setParams(uri.params);
  }, []);

  const error = useMemo(() => parseUri(uriString) === null, [uriString]);

  return (
    <Container maxW="container.lg" pt={10}>
      <HStack mb={6} gap={2}>
        <Image src="/favicon.svg" w={9} h={9} />
        <Heading size="lg">스킴 생성기</Heading>
      </HStack>

      <FormControl isInvalid={error}>
        <FormLabel>스킴</FormLabel>
        <InputGroup>
          <Input
            value={uriString}
            onChange={(e) => {
              onChangeUri(e.target.value);
            }}
          />
          <InputRightElement>
            <IconButton
              aria-label="copy url"
              icon={copied ? <CheckIcon w={3} h={3} /> : <CopyIcon />}
              onClick={() => {
                navigator.clipboard.writeText(uriString);
                setCopied(true);
              }}
            />
          </InputRightElement>
        </InputGroup>
        {error && <FormErrorMessage>유효하지 않은 스킴이에요</FormErrorMessage>}
      </FormControl>

      <Divider my={10} />

      <FormControl>
        <FormLabel>기본 스킴</FormLabel>
        <Input value={uriBase} onChange={(e) => setUriBase(e.target.value)} />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>파라미터</FormLabel>

        <VStack align="stretch">
          {params.map((param, index) => (
            <Flex key={index} gap={2}>
              <IconButton
                aria-label="remove parameter"
                variant="outline"
                icon={<MinusIcon w={3} h={3} />}
                onClick={() => removeParam(index)}
              />
              <Input
                flex={1}
                value={param.key}
                onChange={(e) => updateParams(index, "key")(e.target.value)}
              />
              <Input
                flex={2}
                value={param.value}
                onChange={(e) => updateParams(index, "value")(e.target.value)}
              />
            </Flex>
          ))}

          <Button onClick={addParam} leftIcon={<AddIcon w={3} h={3} />}>
            파라미터 추가하기
          </Button>
        </VStack>
      </FormControl>

      <FormControl mt={10}>
        <FormLabel>메모장</FormLabel>
        <Textarea rows={8} />
      </FormControl>
    </Container>
  );
}

export default App;
