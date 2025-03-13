import {
  Button,
  Container,
  Field,
  Fieldset,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  QrCode,
  Stack,
  StackSeparator,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { produce } from "immer";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { Check, Copy, Minus, Plus } from "lucide-react";
import { toaster } from "./components/ui/toaster";

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
    withDefault(StringParam, "https://www.google.com/search?q=URI+scheme"),
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
  }, [uriBase, setUriBase, searchParams, setUriString]);

  const onChangeUri = useCallback(
    (uriString: string) => {
      setUriString(uriString);

      const uri = parseUri(uriString);

      if (!uri) {
        return;
      }

      setUriBase(uri.base);
      setParams(uri.params);
    },
    [setUriString],
  );

  const error = useMemo(() => parseUri(uriString) === null, [uriString]);

  return (
    <Container maxW="container.xl" pt={10}>
      <HStack mb={6} gap={2}>
        <Image src="/favicon.svg" w={8} h={8} />
        <Heading size="xl">스킴 생성기</Heading>
      </HStack>

      <Stack
        direction={{ base: "column", md: "row" }}
        gap={6}
        separator={<StackSeparator />}
      >
        <Fieldset.Root flex={5}>
          <Fieldset.Legend>기본 스킴</Fieldset.Legend>

          <Fieldset.Content>
            <Field.Root>
              <Input
                value={uriBase}
                onChange={(e) => setUriBase(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </Field.Root>
          </Fieldset.Content>

          <Fieldset.Content>
            <Field.Root mt={4}>
              <Field.Label>쿼리 파라미터</Field.Label>

              <VStack alignSelf="stretch" align="stretch">
                {params.map((param, index) => (
                  <Flex key={index} gap={2}>
                    <IconButton
                      aria-label="remove parameter"
                      variant="outline"
                      onClick={() => removeParam(index)}
                    >
                      <Minus strokeWidth={1.5} />
                    </IconButton>
                    <Input
                      flex={1}
                      value={param.key}
                      onChange={(e) =>
                        updateParams(index, "key")(e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                    <Input
                      flex={3}
                      value={param.value}
                      onChange={(e) =>
                        updateParams(index, "value")(e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </Flex>
                ))}

                <Button variant="surface" color="gray.500" onClick={addParam}>
                  <Plus strokeWidth={1.5} />
                  파라미터 추가하기
                </Button>
              </VStack>
            </Field.Root>
          </Fieldset.Content>
        </Fieldset.Root>

        <Fieldset.Root flex={4}>
          <Fieldset.Legend>결과 스킴</Fieldset.Legend>
          <HStack align="start">
            <QrCode.Root size="lg" value={uriString}>
              <QrCode.Frame>
                <QrCode.Pattern />
              </QrCode.Frame>
            </QrCode.Root>
            <Field.Root invalid={error}>
              <Textarea
                autoresize
                value={uriString}
                onChange={(e) => onChangeUri(e.target.value)}
                onFocus={(e) => e.target.select()}
              />

              {error && (
                <Field.ErrorText>유효하지 않은 스킴이에요</Field.ErrorText>
              )}
            </Field.Root>
          </HStack>

          <Button
            disabled={error}
            onClick={() => {
              navigator.clipboard.writeText(uriString);
              setCopied(true);
              toaster.create({
                type: "success",
                title: "클립보드에 스킴을 복사했어요",
              });
            }}
          >
            {copied ? <Check strokeWidth={1.5} /> : <Copy strokeWidth={1.5} />}
            복사하기
          </Button>
        </Fieldset.Root>
      </Stack>

      <Field.Root mt={10}>
        <Field.Label>메모장</Field.Label>
        <Textarea rows={8} />
      </Field.Root>
    </Container>
  );
}

export default App;
