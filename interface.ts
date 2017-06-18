interface tag {
  id: string;
  name: string;
  type: "nominal" | "dichotomous" | "ordinal" | "interval" | "ratio";
  value: number | string;
}

interface edge {

}

interface node {
  id: string;
  tags: Array<tag>;
}

