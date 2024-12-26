/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLipColorContext } from "../../pages/vto/lips/lip-color/lip-color-context";
import { useMakeup } from "../../context/makeup-context";
import { useVirtualTryOnMakeupsVoice } from "../../context/virtual-try-on-makeups-voice-context";
import {
  lipLinerSizes,
  shadesLipColor,
  stringNumbers,
  subSection,
} from "../../utils/constants";
import { capitalizeWords, getLastPathSegment } from "../../utils/other";
import { filterTextures, textures } from "../../api/attributes/texture";
import { colors } from "../../api/attributes/color";
import { useLipLinerContext } from "../../pages/vto/lips/lip-liner/lip-liner-context";
import { useLipPlumperContext } from "../../pages/vto/lips/lip-plumper/lip-plumper-context";
import { extractUniqueCustomAttributes } from "../../utils/apiUtils";
import { useLipPlumperQuery } from "../../pages/vto/lips/lip-plumper/lip-plumper-query";
import { useEyebrowsContext } from "../../pages/vto/eyes/eyebrows/eyebrows-context";
import { useEyeShadowContext } from "../../pages/vto/eyes/eye-shadow/eye-shadow-context";
import { useEyebrowsQuery } from "../../pages/vto/eyes/eyebrows/eyebrows-query";
import { useLipLinerQuery } from "../../pages/vto/lips/lip-liner/lip-liner-query";
import { useLipColorQuery } from "../../pages/vto/lips/lip-color/lip-color-query";
import { useEyeshadowsQuery } from "../../pages/vto/eyes/eye-shadow/eye-shadow-query";
import { patterns } from "../../api/attributes/pattern";
import { useEyeLinerContext } from "../../pages/vto/eyes/eye-liners/eye-liner-context";
import { useEyelinerQuery } from "../../pages/vto/eyes/eye-liners/eye-liner-query";
import { useLashesContext } from "../../pages/vto/eyes/lashes/lashes-context";
import { useMascaraContext } from "../../pages/vto/eyes/mascara/mascara-context";
import { useMascaraQuery } from "../../pages/vto/eyes/mascara/mascara-query";
import { useFoundationContext } from "../../pages/vto/face/foundation/foundation-context";
import { useFoundationQuery } from "../../pages/vto/face/foundation/foundation-query";
import { useConcealerContext } from "../../pages/vto/face/concealer/concealer-context";
import { useConcealerQuery } from "../../pages/vto/face/concealer/concealer-query";
import { skin_tones } from "../../api/attributes/skin_tone";
import { useContourContext } from "../../pages/vto/face/contour/contour-context";
import { useContourQuery } from "../../pages/vto/face/contour/contour-query";
import { get } from "lodash";
import { useBlushContext } from "../../pages/vto/face/blush/blush-context";
import { useBlushQuery } from "../../pages/vto/face/blush/blush-query";
import { useBronzerContext } from "../../pages/vto/face/bronzer/bronzer-context";
import { useBronzerQuery } from "../../pages/vto/face/bronzer/bronzer-query";
import { useHighlighterContext } from "../../pages/vto/face/highlighter/highlighter-context";
import { useFaceHighlighterQuery } from "../../pages/vto/face/highlighter/highlighter-query";
import { useHairColorContext } from "../../pages/vto/hair/hair-color/hair-color-context";
import { useQueryClient } from "@tanstack/react-query";
import { useSelecProductNumberContext } from "../../pages/vto/select-product-context";

export function useFunctionCommand() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    setSelectedMode,
    setSelectedColors,
    setReplaceIndex,
    setSelectedTexture,
    setColorFamily,
    colorFamily,
    selectedColors,
    selectedMode,
  } = useLipColorContext();
  const {
    setColorFamily: setColorFamilyLinier,
    setSelectedSize: setSelectedSizeLinier,
    colorFamily: colorFamilyLinier,
    setSelectedColor: setSelectedColorLiner,
  } = useLipLinerContext();
  const {
    setLipColors,
    setLipColorMode,
    lipColors,
    setEyebrowsPattern,
    setEyebrowsVisibility,
    setShowEyebrows,
    setEyebrowsColor,
    showEyebrows,
    setShowLipliner,
    showLipliner,
    setLiplinerColor,
    showLipColor,
    setShowLipColor,
    setFoundationColor,
    showFoundation,
    setShowFoundation,
    setBlushMaterial,
    setConcealerColor,
    setShowConcealer,
    showConcealer,
    setContourColors,
    setContourMode,
    setShowContour,
    showContour,
    contourColors,
    setContourShape,
    setHighlighterMaterial,
    setBlushColor,
    setShowBlush,
    showBlush,
    setBlushMode,
    setBlushPattern,
    setBronzerColor,
    showBronzer,
    setShowBronzer,
    setBronzerPattern,
    setHighlighterPattern,
    setHairColor,
    showHair,
    setShowHair,
  } = useMakeup();
  const { setSelectedMakeup } = useVirtualTryOnMakeupsVoice();
  const { pathname } = useLocation();
  const {
    setSelectedColor: setSelectedColorPlumper,
    setSelectedTexture: setSelectedTexturePlumper,
  } = useLipPlumperContext();
  const { selectedProductNumber, setSelectedProductNumber } = useSelecProductNumberContext()

  const {
    colorFamily: colorFamilyEyebrows,
    setColorFamily: setColorFamilyEyebrows,
    setSelectedPattern: setSelectedPatternEyebrows,
    setSelectedColor: setSelectedColorEyebrows,
  } = useEyebrowsContext();
  const {
    setMode: setModeEyeShadow,
    setSelectedTexture: setSelectedTextureEyeShadow,
    setSelectModeIndex: setSelectModeIndexEyeShadow,
    colorFamily: colorFamilyEyeShadow,
    setSelectedColors: setSelectedColorsEyeShadow,
    selectedColors: selectedColorsEyeShadow,
    selectedMode: selectedModeEyeShadow,
  } = useEyeShadowContext();

  const {
    colorFamily: colorFamilyEyeLiner,
    selectedShape,
    setSelectedShape,
    setColorFamily: setColorFamilyEyeLiner,
    setSelectedColor: setSelectedColorEyeLiner,
  } = useEyeLinerContext();
  const {
    selectedPattern,
    setSelectedPattern,
    colorFamily: colorFamilyLashes,
    setColorFamily: setColorFamilyLashes,
  } = useLashesContext();
  const {
    colorFamily: colorFamilyMascara,
    setColorFamily: setColorFamilyMascara,
    selectedColor: selectedColorMascara,
    setSelectedColor: setSelectedColorMascara,
  } = useMascaraContext();
  const {
    colorFamily: colorFamilyFoundation,
    setColorFamily: setColorFamilyFoundation,
    setSelectedColor: setSelectedColorFoundation,
    setSelectedTexture: setSelectedTextureFoundation,
    selectedTexture: selectedTextureFoundation,
  } = useFoundationContext();
  const {
    colorFamily: colorFamilyConcealer,
    setColorFamily: setColorFamilyConcealer,
    setSelectedColor: setSelectedColorConcealer,
  } = useConcealerContext();
  const {
    selectedColors: selectedColorsContour,
    setSelectedColors: setSelectedColorsContour,
    setSelectedMode: setSelectedModeContour,
    selectedMode: selectedModeContour,
    setSelectedShape: setSelectedShapeContour,
    setSelectedTexture: setSelectedTextureContour,
    selectedTexture: selectedTextureContour,
  } = useContourContext();
  const {
    selectedColors: selectedColorsBlush,
    setSelectedColors: setSelectedColorsBlush,
    selectedMode: selectedModeBlush,
    setSelectedTexture: setSelectedTextureBlush,
    setSelectedShape: setSelectedShapeBlush,
    setSelectedMode: setSelectedModeBlush,
    setReplaceIndex: setReplaceIndexBlush,
  } = useBlushContext();
  const replaceIndexRef = useRef(0);
  const {
    setSelectedColor: setSelectedColorBronzer,
    setSelectedShape: setSelectedShapeBronzer,
    selectedTexture: selectedTextureBronzer,
    setSelectedTexture: setSelectedTextureBronzer,
  } = useBronzerContext();
  const {
    setSelectedColor: setSelectedColorHighlighter,
    selectedTexture: selectedTextureHighlighter,
    setSelectedTexture: setSelectedTextureHighlighter,
    setSelectedShape: setSelectedShapeHighlighter,
  } = useHighlighterContext();
  const {
    colorFamily: colorFamilyHairColor,
    setColorFamily: setColorFamilyHairColor,
    selectedColor: selectedColorHairColor,
    setSelectedColor: setSelectedColorHairColor,
  } = useHairColorContext();
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Inisialisasi Speech Recognition
  const initializeRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Web Speech API not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Mendengarkan terus-menerus
    recognition.lang = "en-GB"; // Bahasa Inggris UK
    recognition.interimResults = false;

    // Event handler untuk hasil pengenalan suara
    recognition.onresult = (event) => {
      const lastIndex =
        event.results && event.results.length > 0
          ? event.results.length - 1
          : 0; // Index hasil terakhir
      const speechResult = event.results[lastIndex][0].transcript.toLowerCase();
      console.log("Transcript:", speechResult);
      handleCommand(speechResult);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setRecording(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      setRecording(false);
    };

    return recognition;
  };

  // Start listening
  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }

    if (recognitionRef.current && !recording) {
      recognitionRef.current.start();
      setRecording(true);
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && recording) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  };

  // Function to handle both navigation and scroll commands
  const handleCommand = (transcript: any) => {
    const sectionRegex = /go to section (.+)/i;
    const subSectionRegex = /select (.+)/i;
    const addCartRegex = /(.*?) add to cart/i;
    const colorModeRegex = /set (.+)/i;
    const textureModeRegex = /select texture (.+)/i;
    const ColorRegex = /select (.+)/i;
    const ColorChildernRegex = /select color (.+)/i;
    const patternRegex = /set pattern (.+)/i;
    const darknesRegex = /.*dark (.+)/i;
    const selectProduct = /select product number (\d+|\w+)/i;

    const includesSubSectionName = (name: string) =>
      subSection.some(
        (item) =>
          item.name == name ||
          item.name.split(" ").join("").toLowerCase() == name.toLowerCase(),
      );

      const numberWords: { [key: string]: number } = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
      };
      
    if (selectProduct.test(transcript)) {
      let productNumber = transcript.match(selectProduct)?.[1]; // Ambil angka atau kata dari grup pertama
    
      // Jika nilai adalah kata, konversikan ke angka
      if (productNumber && isNaN(Number(productNumber))) {
        productNumber = numberWords[productNumber.toLowerCase()]?.toString();
      }
    
      // Konversi ke number
      const numericProductNumber = Number(productNumber);
    
      // Check if the product number is different before setting the state
      if (!isNaN(numericProductNumber) && numericProductNumber !== Number(selectedProductNumber)) {
        setSelectedProductNumber(numericProductNumber);
      }
    }
      
    // Check for section
    if (sectionRegex.test(transcript)) {
      const section = capitalizeWords(
        transcript.match(sectionRegex)[1].toLowerCase().trim(),
      );
      if (["Lips", "Eyes", "Face", "Hair"].includes(section))
        handleSectionCommand(section);
    }
    // Check for sub section
    if (subSectionRegex.test(transcript)) {
      const subSection = capitalizeWords(
        transcript.match(subSectionRegex)[1].toLowerCase().trim(),
      );

      if (includesSubSectionName(subSection))
        handleSubSectionCommand(subSection);
    }
    // Check for add cart
    if (addCartRegex.test(transcript)) {
      const product = transcript.match(addCartRegex)[1].toLowerCase().trim();
      console.log(product, "product");
    }
    // Check for color mode
    if (colorModeRegex.test(transcript)) {
      const colorMode = capitalizeWords(
        transcript.match(colorModeRegex)[1].toLowerCase().trim(),
      );
      handleSetColorMode(colorMode);
    }
    // Check for color texture
    if (textureModeRegex.test(transcript)) {
      const textureMode = capitalizeWords(
        transcript.match(textureModeRegex)[1].toLowerCase().trim(),
      );
      handleSetTextureMode(textureMode);
    }
    // Check for color
    if (ColorRegex.test(transcript)) {
      let color = capitalizeWords(
        transcript.match(ColorRegex)[1].toLowerCase().trim(),
      ).replace(" Color", "");
      if (color == 'Gray') {
        color = 'Grey';
      }
      const colorValue = colors.find((e) => e.label == color)?.value || "";
      handleSetColor(colorValue, color);
    }
    // Check for color childern
    if (ColorChildernRegex.test(transcript)) {
      let index = capitalizeWords(
        transcript.match(ColorChildernRegex)[1].toLowerCase().trim(),
      );
      if (stringNumbers.includes(index.toLowerCase())) {
        index = (stringNumbers.indexOf(index.toLowerCase()) + 1).toString();
      }
      handleSetColorChildern(index);
    }
    // Check pattern
    if (patternRegex.test(transcript)) {
      const pattern = capitalizeWords(
        transcript.match(patternRegex)[1].toLowerCase().trim(),
      );
      handleSelectPattern(pattern);
    }
    // Check darknes
    if (darknesRegex.test(transcript)) {
      const darknes = capitalizeWords(
        transcript.match(darknesRegex)[1].toLowerCase().trim(),
      );
      handleSetDarknes(darknes);
    }
  };

  const handleSectionCommand = (section: string) => {
    setSelectedMakeup(section);
  };

  const handleSubSectionCommand = (section: string) => {
    const path =
      subSection.find(
        (e) =>
          e.name == section ||
          e.name.split(" ").join("").toLowerCase() == section.toLowerCase(),
      )?.path || null;
    if (path) {
      navigate(`/virtual-try-on/${path}`);
    }
  };

  function handleSetColorMode(mode: string) {
    if (
      getLastPathSegment(pathname) == "lip-color" &&
      shadesLipColor.includes(mode)
    ) {
      setSelectedMode(mode);
      if (mode == "Dual") {
        setLipColorMode(mode);
      }
      if (mode == "Ombre") {
        setLipColorMode(mode);
      }

      if (mode === "One" && lipColors.length > 1) {
        const newColors = [lipColors[0]];
        setSelectedColors(newColors);
        setLipColors(newColors);
        setReplaceIndex(0);
      }
    }
    if (getLastPathSegment(pathname) == "eye-shadow") {
      setModeEyeShadow(mode);
    }
    if (
      getLastPathSegment(pathname) == "contour" &&
      ["One", "Dual"].includes(mode)
    ) {
      setSelectedModeContour(mode);

      if (mode == "One") {
        setContourMode(mode);
        if (selectedModeContour === "One" && contourColors.length > 1) {
          setSelectedColorsContour([contourColors[0]]);
          setContourColors([contourColors[0]]);
        }
      }
    }
    if (
      getLastPathSegment(pathname) == "blush" &&
      ["One", "Dual", "Tri"].includes(mode)
    ) {
      setSelectedModeBlush(mode as "One" | "Dual" | "Tri");
      if (mode === "One") {
        setBlushMode(mode);
      }
      if (mode == "Tri") {
        setBlushMode(mode);
      }

      if (mode === "One" && lipColors.length > 1) {
        const newColors = [lipColors[0]];
        setSelectedColorsBlush(newColors);
        setLipColors(newColors);
        setReplaceIndexBlush(0);
      }
    }
  }

  const handleSetColor = async (colorCode: string, color: string) => {
    if (getLastPathSegment(pathname) == "lip-color" && colorCode !== "") {
      console.log(colorCode, "colorCode");
      setColorFamily(colorCode);
      await queryClient.invalidateQueries({
        queryKey: ["products", "lipcolor", colorCode, null, null],
      });
    }
    if (getLastPathSegment(pathname) == "lip-plumper") {
      const dataUseLipPlumperQuery: any = queryClient.getQueryData([
        "products",
        "lip-plumper",
        null,
        null,
      ]);
      const colorData = extractUniqueCustomAttributes(
        dataUseLipPlumperQuery?.items ?? [],
        "hexacode",
      );
      const isColor = ["Purple", "Orange", "Pink"].findIndex((e) => e == color);
      if (isColor !== -1) setSelectedColorPlumper(colorData[isColor]);
    }
    if (getLastPathSegment(pathname) == "lip-liner" && colorCode !== "") {
      setColorFamilyLinier(colorCode);
    }
    if (getLastPathSegment(pathname) == "eyebrows" && colorCode !== "") {
      setColorFamilyEyebrows(colorCode);
    }
    if (getLastPathSegment(pathname) == "eye-liner" && colorCode !== "") {
      setColorFamilyEyeLiner(colorCode);
    }
    if (getLastPathSegment(pathname) == "lashes" && colorCode !== "") {
      setColorFamilyLashes(colorCode);
    }
    if (getLastPathSegment(pathname) == "mascara" && colorCode !== "") {
      setColorFamilyMascara(colorCode);
    }
    if (getLastPathSegment(pathname) == "foundation") {
      const colorId =
        skin_tones.find(
          (e) => e.name == color || e.name.toLowerCase() == color.toLowerCase(),
        )?.id || null;

      if (colorId) {
        setColorFamilyFoundation(colorId);
      }
    }
    if (getLastPathSegment(pathname) == "concealer") {
      const colorId =
        skin_tones.find(
          (e) => e.name == color || e.name.toLowerCase() == color.toLowerCase(),
        )?.id || null;

      if (colorId) {
        setColorFamilyConcealer(colorId);
      }
    }
    if (getLastPathSegment(pathname) == "hair-color" && colorCode !== "") {
      setColorFamilyHairColor(colorCode);
    }
  };

  const handleSetColorChildern = (index: string) => {
    if (getLastPathSegment(pathname) == "lip-color") {
      console.log(colorFamily, "colorFamily");
      const data: any = queryClient.getQueryData([
        "products",
        "lipcolor",
        colorFamily,
        null,
        null,
      ]);
      const colorData = extractUniqueCustomAttributes(
        data?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));

      console.log(colorData, "colorData");

      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const lipColor = colorData[indexPattern];
        console.log(lipColor, "lipColor");

        if (!showLipColor) setShowLipColor(true);
        // Handle color deselection
        if (selectedColors.includes(lipColor)) {
          const newColors = selectedColors.filter((c) => c !== lipColor);
          console.log(newColors, "newColors");
          setSelectedColors(newColors);
          setLipColors(newColors);
          return;
        }
        // Handle different modes
        const isMultiColorMode =
          selectedMode === "Dual" || selectedMode === "Ombre";
        const maxColors = isMultiColorMode ? 2 : 1;
        setLipColorMode(isMultiColorMode ? "Dual" : "One");
        // Update colors by either adding new color or replacing the oldest one
        const newColors =
          selectedColors.length < maxColors
            ? [...selectedColors, lipColor]
            : [...selectedColors.slice(1), lipColor]; // Remove oldest, add new
        console.log(newColors, "newColors");
        setSelectedColors(newColors);
        setLipColors(newColors);
      }
    }
    if (getLastPathSegment(pathname) == "lip-liner") {
      const datauseLipLinerQuery: any = queryClient.getQueryData([
        "products",
        "lipliner",
        colorFamilyLinier,
        null,
        null,
      ]);
      const colorData = extractUniqueCustomAttributes(
        datauseLipLinerQuery?.items ?? [],
        "hexacode",
      );

      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        if (!showLipliner) {
          setShowLipliner(true);
        }
        setSelectedColorLiner(color);
        setLiplinerColor(color);
      }
    }
    if (getLastPathSegment(pathname) == "eyebrows") {
      const datauseEyebrowsQuery: any = queryClient.getQueryData([
        "products",
        "eyebrows",
        colorFamilyEyebrows,
        null,
      ]);

      const colorData = extractUniqueCustomAttributes(
        datauseEyebrowsQuery?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));
      console.log(colorData, "colorData");

      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        if (!showEyebrows) {
          setShowEyebrows(true);
        }
        setSelectedColorEyebrows(color);
        setEyebrowsColor(color);
      }
    }
    if (getLastPathSegment(pathname) == "eye-shadow") {
      // Handle color deselection
      const maxColorsMap: {
        [key: string]: number;
      } = {
        One: 1,
        Dual: 2,
        Tri: 3,
        Quadra: 4,
        Tetra: 5,
      };
      const maxColors = maxColorsMap[selectedModeEyeShadow] || 1;
      const datauseEyeshadowsQuery: any = queryClient.getQueryData([
        "products",
        "eyeshadows",
        null,
        null,
        null,
      ]);
      console.log(datauseEyeshadowsQuery, "datauseEyeshadowsQuery");

      const colorData = extractUniqueCustomAttributes(
        datauseEyeshadowsQuery?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));

      const indexPattern = parseInt(index) - 1;
      console.log(colorData, "colorData");

      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        console.log(color, "color");

        if (selectedColorsEyeShadow.includes(color)) {
          setSelectedColorsEyeShadow(
            selectedColorsEyeShadow.filter((c) => c !== color),
          );
          return;
        }

        // Update colors by either adding new color or replacing the oldest one
        const newColors =
          selectedColorsEyeShadow.length < maxColors
            ? [...selectedColorsEyeShadow, color]
            : [...selectedColorsEyeShadow.slice(1), color]; // Remove oldest, add new

        console.log(newColors, "newColors");

        setSelectedColorsEyeShadow(newColors);
      }
    }
    if (getLastPathSegment(pathname) == "eye-liner") {
      const datauseEyelinerQuery: any = queryClient.getQueryData([
        "products",
        "eyeliners",
        colorFamilyEyeLiner,
        null,
      ]);
      const colorData = extractUniqueCustomAttributes(
        datauseEyelinerQuery?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));
      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        setSelectedColorEyeLiner(color);
      }
    }
    if (getLastPathSegment(pathname) == "mascara") {
      const datauseMascaraQuery: any = queryClient.getQueryData([
        "products",
        "mascara",
        colorFamilyMascara,
        null,
      ]);
      const colorData = extractUniqueCustomAttributes(
        datauseMascaraQuery?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));
      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        setSelectedColorMascara(color);
      }
    }
    if (getLastPathSegment(pathname) == "foundation") {
      const datauseFoundationQuery: any = queryClient.getQueryData([
        "products",
        "foundations",
        colorFamilyFoundation,
        null,
      ]);
      const colorData = extractUniqueCustomAttributes(
        datauseFoundationQuery?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));
      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        console.log(color, "color");
        if (!showFoundation) {
          setShowFoundation(true);
        }
        setSelectedColorFoundation(color);
        setFoundationColor(color);
      }
    }
    if (getLastPathSegment(pathname) == "concealer") {
      const datauseConcealerQuery: any = queryClient.getQueryData([
        "products",
        "concealers",
        colorFamilyConcealer,
      ]);
      const colorData = extractUniqueCustomAttributes(
        datauseConcealerQuery?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));
      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        if (!showConcealer) {
          setShowConcealer(true);
        }
        setSelectedColorConcealer(color);
        setConcealerColor(color);
      }
    }
    if (getLastPathSegment(pathname) == "contour") {
      const datauseContourQuery: any = queryClient.getQueryData([
        "products",
        "contours",
        null,
      ]);
      const colorData = extractUniqueCustomAttributes(
        datauseContourQuery?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));
      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        if (!showContour) {
          setShowContour(true);
        }
        // Handle color deselection
        if (selectedColorsContour.includes(color)) {
          const newColors = selectedColorsContour.filter((c) => c !== color);
          setSelectedColorsContour(newColors);
          setContourColors(newColors);
          return;
        }
        // Handle different modes
        const isMultiColorMode = selectedModeContour === "Dual";
        const maxColors = isMultiColorMode ? 2 : 1;

        setContourMode(isMultiColorMode ? "Dual" : "One");

        // Update colors by either adding new color or replacing the oldest one
        const newColors =
          selectedColorsContour.length < maxColors
            ? [...selectedColorsContour, color]
            : [...selectedColorsContour.slice(1), color]; // Remove oldest, add new

        setSelectedColorsContour(newColors);
        setContourColors(newColors);
      }
    }
    if (getLastPathSegment(pathname) == "blush") {
      const datauseBlushQuery: any = queryClient.getQueryData([
        "products",
        "faceblush",
        null,
      ]);
      const colorData = extractUniqueCustomAttributes(
        datauseBlushQuery?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));

      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        if (!showBlush) {
          setShowBlush(true);
        }
        if (selectedColorsBlush.includes(color)) {
          // Deselect the color if it's already selected
          setSelectedColorsBlush(
            selectedColorsBlush.filter((c) => c !== color),
          );
          setBlushColor(selectedColorsBlush.filter((c) => c !== color));
        } else if (selectedModeBlush === "One") {
          setBlushMode("One");
          // In "One" mode, only one color can be selected
          setSelectedColorsBlush([color]);
          setBlushColor([color]);
        } else if (selectedModeBlush === "Dual") {
          setBlushMode("Dual");
          if (selectedColorsBlush.length < 2) {
            // Add the color if less than two are selected
            setSelectedColorsBlush([...selectedColorsBlush, color]);
            setBlushColor([...selectedColorsBlush, color]);
          } else {
            // Replace the color based on replaceIndexRef
            const newSelectedColors = [...selectedColorsBlush];
            newSelectedColors[replaceIndexRef.current] = color;
            setSelectedColorsBlush(newSelectedColors);
            setBlushColor(newSelectedColors);
            // Update replaceIndexRef to alternate between 0 and 1
            replaceIndexRef.current = (replaceIndexRef.current + 1) % 2;
          }
        } else if (selectedModeBlush === "Tri") {
          setBlushMode("Tri");
          if (selectedColorsBlush.length < 3) {
            setSelectedColorsBlush([...selectedColorsBlush, color]);
            setBlushColor([...selectedColorsBlush, color]);
          } else {
            const newSelectedColors = [...selectedColorsBlush];
            newSelectedColors[replaceIndexRef.current] = color;
            setSelectedColorsBlush(newSelectedColors);
            setBlushColor(newSelectedColors);
            replaceIndexRef.current =
              replaceIndexRef.current > 1 ? 0 : replaceIndexRef.current + 1;
          }
        }
      }
    }
    if (getLastPathSegment(pathname) == "bronzer") {
      const datauseBronzerQuery: any = queryClient.getQueryData([
        "products",
        "bronzers",
        null,
        null,
      ]);
      const colorData = extractUniqueCustomAttributes(
        datauseBronzerQuery?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));

      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        if (!showBronzer) {
          setShowBronzer(true);
        }
        setSelectedColorBronzer(color);
        setBronzerColor(color);
      }
    }
    if (getLastPathSegment(pathname) == "highlighter") {
      const datauseFaceHighlighterQuery: any = queryClient.getQueryData([
        "products",
        "facehighlighter",
        null,
        null,
      ]);
      const colorData = extractUniqueCustomAttributes(
        datauseFaceHighlighterQuery?.items ?? [],
        "hexacode",
      ).flatMap((item) => item.split(","));

      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        setSelectedColorHighlighter(color);
      }
    }
    if (getLastPathSegment(pathname) == "hair-color") {
      const colorData = [
        "#d9be95",
        "#784405",
        "#403007",
        "#403007",
        "#181305",
        "#181305",
        "#b7a189",
        "#483209",
      ];
      const indexPattern = parseInt(index) - 1;
      if (indexPattern >= 0) {
        const color = colorData[indexPattern];
        if (!showHair) {
          setShowHair(true);
        }
        setSelectedColorHairColor(indexPattern.toString());
        setHairColor(color);
      }
    }
  };

  const handleSelectPattern = (pattern: string) => {
    if (getLastPathSegment(pathname) == "lip-liner") {
      const patternValue =
        lipLinerSizes.find(
          (e, idx) => e.label == pattern || idx + 1 == parseInt(pattern),
        )?.value || null;
      console.log(patternValue, "patternValue");
      if (patternValue) setSelectedSizeLinier(patternValue);
    }
    if (getLastPathSegment(pathname) == "eyebrows") {
      const indexPattern = parseInt(pattern) - 1;
      console.log(indexPattern, "indexPattern");
      if (indexPattern >= 0) {
        setSelectedPatternEyebrows(indexPattern.toString());
        setEyebrowsPattern(indexPattern);
      }
    }
    if (getLastPathSegment(pathname) == "eye-shadow") {
      const indexPattern = parseInt(pattern) - 1;
      console.log(indexPattern, "indexPattern");
      if (indexPattern >= 0) {
        setSelectModeIndexEyeShadow(indexPattern);
      }
    }
    if (getLastPathSegment(pathname) == "eye-liner") {
      const indexPattern = parseInt(pattern) - 1;
      console.log(parseInt(pattern), indexPattern, "indexPattern");
      if (indexPattern >= 0) {
        const value = patterns.eyeliners[indexPattern].value;
        setSelectedShape(value);
      }
    }
    if (getLastPathSegment(pathname) == "lashes") {
      const indexPattern = parseInt(pattern) - 1;
      console.log(parseInt(pattern), indexPattern, "indexPattern");
      if (indexPattern >= 0) {
        const value = patterns.eyelashes[indexPattern].value;
        setSelectedPattern(value);
      }
    }
    if (getLastPathSegment(pathname) == "contour") {
      const indexPattern = parseInt(pattern) - 1;
      console.log(indexPattern, "indexPattern");
      if (indexPattern >= 0) {
        setContourShape(indexPattern.toString());
        setSelectedShapeContour(indexPattern.toString());
      }
    }
    if (getLastPathSegment(pathname) == "blush") {
      const indexPattern = parseInt(pattern) - 1;
      console.log(indexPattern, "indexPattern");
      if (indexPattern >= 0) {
        setBlushPattern(indexPattern);
        setSelectedShapeBlush(indexPattern.toString());
      }
    }
    if (getLastPathSegment(pathname) == "bronzer") {
      const indexPattern = parseInt(pattern) - 1;
      console.log(indexPattern, "indexPattern");
      if (indexPattern >= 0) {
        setBronzerPattern(indexPattern);
        setSelectedShapeBronzer(indexPattern.toString());
      }
    }
    if (getLastPathSegment(pathname) == "highlighter") {
      const indexPattern = parseInt(pattern) - 1;
      console.log(indexPattern, "indexPattern");
      if (indexPattern >= 0) {
        setHighlighterPattern(indexPattern);
        setSelectedShapeHighlighter(indexPattern.toString());
      }
    }
  };

  const handleSetTextureMode = (textureMode: string) => {
    const textureValue =
      textures.find(
        (e) =>
          e.label == textureMode ||
          e.label.toLowerCase() == textureMode.toLowerCase(),
      )?.value || null;
    console.log(textureValue, "textureValue");

    if (getLastPathSegment(pathname) == "lip-color" && textureValue) {
      setSelectedTexture(textureValue);
    }
    if (getLastPathSegment(pathname) == "lip-plumper" && textureValue) {
      setSelectedTexturePlumper(textureMode);
    }
    if (getLastPathSegment(pathname) == "eye-shadow" && textureValue) {
      setSelectedTextureEyeShadow(textureValue);
    }
    if (getLastPathSegment(pathname) == "foundation" && textureValue) {
      if (selectedTextureFoundation === textureValue) {
        setSelectedTextureFoundation(null);
      } else {
        setSelectedTextureFoundation(textureValue);
      }
    }
    if (getLastPathSegment(pathname) == "contour" && textureValue) {
      const textures = filterTextures(["Metallic", "Matte", "Shimmer"]);
      if (selectedTextureContour === textureValue) {
        setSelectedTextureContour(null);
      } else {
        setSelectedTextureContour(textureValue);
      }
      const indexMaterial = textures.findIndex((e) => e.label == textureMode);
      setHighlighterMaterial(indexMaterial);
    }
    if (getLastPathSegment(pathname) == "blush" && textureValue) {
      const textures = filterTextures(["Metallic", "Matte", "Shimmer"]);
      if (selectedTextureContour === textureValue) {
        setSelectedTextureBlush(null);
      } else {
        setSelectedTextureBlush(textureValue);
      }
      const indexMaterial = textures.findIndex((e) => e.label == textureMode);
      setBlushMaterial(indexMaterial);
    }
    if (getLastPathSegment(pathname) == "bronzer" && textureValue) {
      const textures = filterTextures(["Metallic", "Matte", "Shimmer"]);
      if (selectedTextureBronzer === textureValue) {
        setSelectedTextureBronzer(null);
      } else {
        setSelectedTextureBronzer(textureValue);
      }
      const indexMaterial = textures.findIndex((e) => e.label == textureMode);
      setHighlighterMaterial(indexMaterial);
    }
    if (getLastPathSegment(pathname) == "highlighter" && textureValue) {
      const textures = filterTextures(["Metallic", "Matte", "Shimmer"]);
      if (selectedTextureHighlighter === textureValue) {
        setSelectedTextureHighlighter(null);
      } else {
        setSelectedTextureHighlighter(textureValue);
      }
      const indexMaterial = textures.findIndex((e) => e.label == textureMode);
      setHighlighterMaterial(indexMaterial);
    }
  };

  const handleSetDarknes = (darknes: string) => {
    const valueDarknes = parseFloat(darknes);

    if (typeof valueDarknes === "number") {
      console.log(valueDarknes / 100, "valueDarknes");
      setEyebrowsVisibility(valueDarknes / 100);
    }
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return { recording, setRecording, startListening, stopListening };
}
