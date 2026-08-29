"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { campusAreas } from "@/data/campusPhotos.generated";

const ASSET_ROOT = "/images/conoce-champal/campus";
const EASE_OUT = [0.22, 1, 0.36, 1];
const GROUP_DURATION = 600;
const PHOTO_DURATION = 550;
const GROUP_SIZE = 5;

const groups = Array.from({ length: 3 }, (_, index) =>
  campusAreas.slice(index * GROUP_SIZE, (index + 1) * GROUP_SIZE),
);

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new window.Image();
    const finish = () => resolve(src);
    image.src = src;
    if (image.complete) {
      image.decode?.().then(finish, finish) ?? finish();
      return;
    }
    image.onload = () => image.decode?.().then(finish, finish) ?? finish();
    image.onerror = finish;
  });
}

function AreaVisual({ area }) {
  return (
    <span className="campus-area-visual" aria-hidden="true">
      <Image src={area.icon} alt="" fill sizes="200px" className="campus-area-icon" />
    </span>
  );
}

function TechnicalGroup({ areas, role, direction }) {
  return (
    <div
      className={`campus-technical-group is-${role}`}
      data-direction={direction}
      aria-hidden="true"
    >
      {areas.map((area, index) => (
        <span className="campus-technical-item" style={{ "--item-index": index }} key={area.id}>
          <AreaVisual area={area} />
        </span>
      ))}
    </div>
  );
}

export default function CampusInteractivo() {
  const reduceMotion = useReducedMotion();
  const mountedRef = useRef(true);
  const groupTimerRef = useRef(null);
  const inviteTimerRef = useRef(null);
  const photoTimerRef = useRef(null);
  const photoFrameRef = useRef(null);
  const photoOperationRef = useRef(0);
  const viewerRef = useRef(null);

  const [groupIndex, setGroupIndex] = useState(0);
  const [groupTransition, setGroupTransition] = useState(null);
  const [groupPrompt, setGroupPrompt] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [incomingPhoto, setIncomingPhoto] = useState(null);
  const [incomingVisible, setIncomingVisible] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [photoTransitioning, setPhotoTransitioning] = useState(false);
  const [announcement, setAnnouncement] = useState("Áreas 1 a 5 de 15");

  const selectedArea = useMemo(
    () => campusAreas.find((area) => area.id === selectedAreaId) ?? null,
    [selectedAreaId],
  );
  const visibleAreas = groups[groupIndex];
  const photoDuration = reduceMotion ? 20 : PHOTO_DURATION;
  const groupDuration = reduceMotion ? 20 : GROUP_DURATION;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      photoOperationRef.current += 1;
      window.clearTimeout(groupTimerRef.current);
      window.clearTimeout(inviteTimerRef.current);
      window.clearTimeout(photoTimerRef.current);
      if (photoFrameRef.current !== null) cancelAnimationFrame(photoFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;
    inviteTimerRef.current = window.setTimeout(() => {
      if (mountedRef.current) setGroupPrompt(true);
    }, 2200);
    return () => window.clearTimeout(inviteTimerRef.current);
  }, [reduceMotion]);

  useEffect(() => {
    if (!selectedArea || selectedArea.photos.length < 2) return;
    const previous = (photoIndex - 1 + selectedArea.photos.length) % selectedArea.photos.length;
    const next = (photoIndex + 1) % selectedArea.photos.length;
    preloadImage(selectedArea.photos[previous]);
    preloadImage(selectedArea.photos[next]);
  }, [photoIndex, selectedArea]);

  const transitionToPhoto = useCallback(async (src, nextIndex, areaLabel, photoCount) => {
    const operation = ++photoOperationRef.current;
    setPhotoTransitioning(true);
    await preloadImage(src);
    if (!mountedRef.current || operation !== photoOperationRef.current) return;

    if (!currentPhoto || !viewerVisible) {
      setCurrentPhoto(src);
      setPhotoIndex(nextIndex);
      setIncomingPhoto(null);
      setViewerVisible(true);
      setPhotoTransitioning(false);
      setAnnouncement(`Fotografía ${nextIndex + 1} de ${photoCount}, ${areaLabel}`);
      return;
    }

    setIncomingPhoto(src);
    setIncomingVisible(false);
    photoFrameRef.current = requestAnimationFrame(() => {
      photoFrameRef.current = requestAnimationFrame(() => setIncomingVisible(true));
    });
    photoTimerRef.current = window.setTimeout(() => {
      if (!mountedRef.current || operation !== photoOperationRef.current) return;
      setCurrentPhoto(src);
      setPhotoIndex(nextIndex);
      setIncomingPhoto(null);
      setIncomingVisible(false);
      setPhotoTransitioning(false);
      setAnnouncement(`Fotografía ${nextIndex + 1} de ${photoCount}, ${areaLabel}`);
    }, photoDuration);
  }, [currentPhoto, photoDuration, viewerVisible]);

  const selectArea = useCallback((area) => {
    setSelectedAreaId(area.id);
    setPhotoIndex(0);
    if (area.photos.length === 0) {
      photoOperationRef.current += 1;
      window.clearTimeout(photoTimerRef.current);
      setPhotoTransitioning(false);
      setIncomingPhoto(null);
      setIncomingVisible(false);
      setViewerVisible(false);
      setAnnouncement("No hay fotografías disponibles");
      return;
    }
    transitionToPhoto(area.photos[0], 0, area.label, area.photos.length);
  }, [transitionToPhoto]);

  const navigatePhoto = useCallback((direction) => {
    if (!selectedArea || selectedArea.photos.length < 2 || photoTransitioning) return;
    const nextIndex = (photoIndex + direction + selectedArea.photos.length) % selectedArea.photos.length;
    transitionToPhoto(selectedArea.photos[nextIndex], nextIndex, selectedArea.label, selectedArea.photos.length);
  }, [photoIndex, photoTransitioning, selectedArea, transitionToPhoto]);

  const navigateGroup = useCallback((direction) => {
    if (groupTransition) return;
    window.clearTimeout(inviteTimerRef.current);
    photoOperationRef.current += 1;
    window.clearTimeout(photoTimerRef.current);
    setGroupPrompt(false);
    setSelectedAreaId(null);
    setPhotoTransitioning(false);
    setIncomingPhoto(null);
    setIncomingVisible(false);
    setViewerVisible(false);
    const nextIndex = (groupIndex + direction + groups.length) % groups.length;
    setGroupTransition({ from: groupIndex, to: nextIndex, direction });
    groupTimerRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setGroupIndex(nextIndex);
      setGroupTransition(null);
      const first = nextIndex * GROUP_SIZE + 1;
      setAnnouncement(`Áreas ${first} a ${first + 4} de 15`);
    }, groupDuration);
  }, [groupDuration, groupIndex, groupTransition]);

  const handleViewerKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigatePhoto(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigatePhoto(1);
    }
  };

  return (
    <section className="campus" aria-labelledby="campus-title">
      <motion.div
        className="campus-background"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.72, ease: EASE_OUT }}
      >
        <Image src={`${ASSET_ROOT}/background.webp`} alt="" fill priority sizes="100vw" className="campus-background-image" />
      </motion.div>

      <div className="campus-curve" aria-hidden="true">
        <Image src={`${ASSET_ROOT}/curve.svg`} alt="" fill sizes="54vw" />
      </div>
      <div className="campus-logo" aria-hidden="true">
        <Image src={`${ASSET_ROOT}/logo-champal-blanco.svg`} alt="" fill sizes="120px" />
      </div>

      <div className="campus-stage">
        <motion.div
          className="campus-bar"
          initial={reduceMotion ? false : { opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 0.42, ease: EASE_OUT }}
        >
          <div
            className="campus-toolbar"
            role="toolbar"
            aria-label="Áreas del Campus"
            aria-busy={groupTransition ? "true" : undefined}
          >
            {!groupTransition && visibleAreas.map((area) => (
              <button
                type="button"
                className="campus-area-button"
                aria-label={area.label}
                aria-pressed={selectedAreaId === area.id}
                onClick={() => selectArea(area)}
                key={area.id}
              >
                <AreaVisual area={area} />
                <span className="campus-tooltip" role="tooltip">{area.label}</span>
              </button>
            ))}
            {groupTransition && (
              <div className="campus-cylinder" aria-hidden="true">
                <TechnicalGroup areas={groups[groupTransition.from]} role="outgoing" direction={groupTransition.direction} />
                <TechnicalGroup areas={groups[groupTransition.to]} role="incoming" direction={groupTransition.direction} />
              </div>
            )}
          </div>
          <p className="sr-only">Áreas {groupIndex * GROUP_SIZE + 1} a {groupIndex * GROUP_SIZE + GROUP_SIZE} de 15</p>

          <motion.div
            className="campus-group-controls"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: reduceMotion ? 1 : [0.55, 1.2, 0.94, 1] }}
            transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 1.48, ease: EASE_OUT }}
          >
            <button type="button" className="campus-group-control is-previous" aria-label="Grupo anterior" disabled={Boolean(groupTransition)} onClick={() => navigateGroup(-1)}>
              <Image src={`${ASSET_ROOT}/group-prev.svg`} alt="" fill sizes="43px" />
              {groupPrompt && !reduceMotion && <span className="campus-invite-rings" aria-hidden="true" />}
            </button>
            <button type="button" className="campus-group-control is-next" aria-label="Grupo siguiente" disabled={Boolean(groupTransition)} onClick={() => navigateGroup(1)}>
              <Image src={`${ASSET_ROOT}/group-next.svg`} alt="" fill sizes="43px" />
              {groupPrompt && !reduceMotion && <span className="campus-invite-rings" aria-hidden="true" />}
            </button>
          </motion.div>
        </motion.div>

        <header className={`campus-copy${viewerVisible ? " is-hidden" : ""}`} aria-hidden={viewerVisible ? "true" : undefined}>
          <motion.div
            className="campus-eyebrow"
            initial={reduceMotion ? false : { opacity: 0, x: -90 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : 0.12, ease: EASE_OUT }}
          >
            <span aria-hidden="true" /><p>NUESTRO COLEGIO</p>
          </motion.div>
          <motion.div
            className="campus-title-reveal"
            initial={reduceMotion ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 0.38, ease: EASE_OUT }}
          >
            <h1 id="campus-title">Espacios diseñados para<br /><span>aprender, crear,</span><br />convivir y crecer</h1>
          </motion.div>
        </header>

        <div
          ref={viewerRef}
          className={`campus-viewer${viewerVisible ? " is-visible" : ""}`}
          role="region"
          aria-label={selectedArea ? `Fotografías de ${selectedArea.label}` : "Fotografías del Campus"}
          tabIndex={viewerVisible ? 0 : -1}
          onKeyDown={handleViewerKeyDown}
        >
          <div className="campus-photo-stage">
            {currentPhoto && <Image src={currentPhoto} alt="" fill unoptimized sizes="(min-width: 1440px) 900px, (min-width: 640px) 62.5vw, 100vw" className="campus-photo is-current" />}
            {incomingPhoto && <Image src={incomingPhoto} alt="" fill unoptimized sizes="(min-width: 1440px) 900px, (min-width: 640px) 62.5vw, 100vw" className={`campus-photo is-incoming${incomingVisible ? " is-visible" : ""}`} style={{ "--photo-duration": `${photoDuration}ms` }} />}
          </div>
        </div>

        {viewerVisible && selectedArea?.photos.length > 1 && (
          <div className="campus-photo-controls">
            <button type="button" className="campus-photo-control" aria-label="Fotografía anterior" disabled={photoTransitioning} onClick={() => navigatePhoto(-1)}>
              <Image src={`${ASSET_ROOT}/photo-prev.svg`} alt="" fill sizes="45px" />
            </button>
            <button type="button" className="campus-photo-control" aria-label="Fotografía siguiente" disabled={photoTransitioning} onClick={() => navigatePhoto(1)}>
              <Image src={`${ASSET_ROOT}/photo-next.svg`} alt="" fill sizes="45px" />
            </button>
          </div>
        )}

        <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
      </div>

      <style>{`
        .campus{position:relative;isolation:isolate;width:100%;min-height:100dvh;overflow-x:hidden;background:#f5f7fa;color:#003750}
        .campus-stage{position:relative;z-index:3;isolation:isolate;width:min(100vw,calc(100dvh * 1440 / 760));aspect-ratio:1440/760;margin-inline:auto;overflow:hidden;container-type:inline-size}
        .campus-background,.campus-background-image{position:absolute;inset:0}.campus-background{z-index:0}.campus-background-image{object-fit:cover;object-position:center center}
        .campus-curve{position:absolute;z-index:1;left:47.05%;top:19.791667vw;width:52.92%;height:32.083333vw;pointer-events:none}.campus-curve img{object-fit:fill}
        .campus-logo{position:absolute;z-index:2;left:90.63%;top:46.673611vw;width:8.33%;height:3.472222vw;pointer-events:none}
        .campus-bar{position:absolute;z-index:8;left:7.2222%;top:2.5%;width:85.5556%;height:31.4474%;border:4px solid #fff;border-radius:16px;background:rgba(0,105,242,.2);box-sizing:border-box}
        .campus-toolbar{position:absolute;left:4.8701%;top:4.1841%;width:90.5844%;height:89.1213%;display:flex;align-items:flex-start;justify-content:center;gap:2.5986%;overflow:hidden;perspective:1050px}
        .campus-area-button,.campus-technical-item{position:relative;width:17.9211%;aspect-ratio:1;flex:0 0 17.9211%;padding:0;border:0;border-radius:50%;background:transparent;color:inherit}
        .campus-area-button{cursor:pointer;transition:transform 220ms ease,filter 220ms ease}.campus-area-visual{position:absolute;inset:0;display:block;border:5px solid #fff;border-radius:50%;overflow:hidden;background:#0758ab;box-shadow:0 4px 8px rgba(0,38,86,.22)}
        .campus-area-icon{object-fit:contain;padding:7%;box-sizing:border-box}.campus-area-button:hover{transform:translateY(-3px) scale(1.025);filter:drop-shadow(0 0 9px rgba(104,207,255,.72))}
        .campus-area-button[aria-pressed=true] .campus-area-visual{box-shadow:0 0 0 4px #65d5ff,0 5px 14px rgba(0,55,102,.38)}
        .campus-area-button:focus-visible,.campus-group-control:focus-visible,.campus-photo-control:focus-visible,.campus-viewer:focus-visible{outline:3px solid #63d6ff;outline-offset:4px}
        .campus-tooltip{position:absolute;z-index:3;left:50%;bottom:2%;max-width:92%;padding:4px 8px;border-radius:8px;background:rgba(0,37,74,.9);color:#fff;font-family:var(--font-outfit),sans-serif;font-size:12px;line-height:1.2;white-space:nowrap;opacity:0;transform:translate(-50%,5px);pointer-events:none;transition:opacity 180ms ease,transform 180ms ease}
        .campus-area-button:hover .campus-tooltip,.campus-area-button:focus-visible .campus-tooltip{opacity:1;transform:translate(-50%,0)}
        .campus-cylinder{position:absolute;inset:0;transform-style:preserve-3d}.campus-technical-group{position:absolute;inset:0;display:flex;justify-content:center;gap:2.5986%;transform-style:preserve-3d}
        .campus-technical-item{backface-visibility:hidden;animation-duration:${GROUP_DURATION}ms;animation-timing-function:cubic-bezier(.22,1,.36,1);animation-fill-mode:both;animation-delay:calc(var(--item-index) * 18ms)}
        .campus-technical-group.is-outgoing[data-direction="1"] .campus-technical-item{animation-name:campus-roll-out-up}.campus-technical-group.is-incoming[data-direction="1"] .campus-technical-item{animation-name:campus-roll-in-up}
        .campus-technical-group.is-outgoing[data-direction="-1"] .campus-technical-item{animation-name:campus-roll-out-down}.campus-technical-group.is-incoming[data-direction="-1"] .campus-technical-item{animation-name:campus-roll-in-down}
        @keyframes campus-roll-out-up{to{opacity:0;transform:translateY(-82%) rotateX(72deg)}}@keyframes campus-roll-in-up{from{opacity:0;transform:translateY(82%) rotateX(-72deg)}to{opacity:1;transform:none}}
        @keyframes campus-roll-out-down{to{opacity:0;transform:translateY(82%) rotateX(-72deg)}}@keyframes campus-roll-in-down{from{opacity:0;transform:translateY(-82%) rotateX(72deg)}to{opacity:1;transform:none}}
        .campus-group-controls{position:absolute;inset:0;pointer-events:none}.campus-group-control{position:absolute;z-index:3;right:.49%;width:44px;height:44px;padding:4px;border:0;background:transparent;border-radius:50%;cursor:pointer;pointer-events:auto}.campus-group-control.is-previous{top:4.18%}.campus-group-control.is-next{bottom:3.35%}.campus-group-control:disabled{cursor:default}.campus-group-control img{object-fit:contain}.campus-group-control.is-previous img{transform:rotate(90deg)}.campus-group-control.is-next img{transform:rotate(-90deg)}
        .campus-invite-rings,.campus-invite-rings:before,.campus-invite-rings:after{position:absolute;inset:4px;border:1.5px solid rgba(104,211,255,.78);border-radius:50%;pointer-events:none;content:"";animation:campus-ring 1.55s ease-out 3 both}.campus-invite-rings:before{inset:0;animation-delay:.32s}.campus-invite-rings:after{inset:0;animation-delay:.64s}
        @keyframes campus-ring{0%{opacity:0;transform:scale(.82)}18%{opacity:.7}100%{opacity:0;transform:scale(1.95)}}
        .campus-copy{position:absolute;z-index:3;left:12.36%;top:40.53%;width:37.3%;opacity:1;transition:opacity ${PHOTO_DURATION}ms cubic-bezier(.22,1,.36,1)}.campus-copy.is-hidden{opacity:0;pointer-events:none}
        .campus-eyebrow{display:flex;align-items:center;gap:4px;height:18px;font-family:var(--font-outfit),sans-serif}.campus-eyebrow span{width:40px;height:6px;flex:none;background:#aa181f}.campus-eyebrow p{margin:0;font-size:15px;font-weight:600;line-height:18px;letter-spacing:.18px}
        .campus-title-reveal{overflow:hidden}.campus-copy h1{margin:15px 0 0;font-family:var(--font-fredoka),sans-serif;font-size:40px;font-weight:500;line-height:1.2;text-shadow:0 4px 4px rgba(0,0,0,.25)}.campus-copy h1 span{font-size:48px}
        .campus-viewer{position:absolute;z-index:10;left:18.75%;top:35.9211%;width:62.5%;height:59.2105%;box-sizing:border-box;overflow:hidden;border:8px solid #fff;background:#c7c7c7;box-shadow:0 4px 12px rgba(0,35,79,.2);opacity:0;pointer-events:none;transition:opacity ${PHOTO_DURATION}ms cubic-bezier(.22,1,.36,1)}.campus-viewer.is-visible{opacity:1;pointer-events:auto}
        .campus-photo-stage,.campus-photo{position:absolute;inset:0;width:100%;height:100%}.campus-photo-stage{overflow:hidden}.campus-photo{object-fit:contain;object-position:center}.campus-photo.is-current{opacity:1}.campus-photo.is-incoming{opacity:0;transition:opacity var(--photo-duration) cubic-bezier(.22,1,.36,1)}.campus-photo.is-incoming.is-visible{opacity:1}
        .campus-photo-controls{position:absolute;z-index:12;left:43.9583%;top:89.4737%;width:11.3889%;height:8.6842%;display:flex;align-items:center;justify-content:center;gap:14px;border:1px solid #003bff;border-radius:12px;background:rgba(5,123,134,.2);box-shadow:0 4px 4px rgba(0,0,0,.25)}
        .campus-photo-control{position:relative;width:45px;height:45px;flex:0 0 45px;padding:0;border:0;border-radius:50%;background:transparent;cursor:pointer;transition:transform 200ms ease,filter 200ms ease}.campus-photo-control:last-child img{transform:rotate(180deg)}.campus-photo-control:hover:not(:disabled){transform:scale(1.08);filter:drop-shadow(0 0 8px rgba(99,214,255,.9))}.campus-photo-control:disabled{cursor:default}
        @media(min-width:1024px){.campus{width:100vw;overflow:hidden}.campus-curve{left:max(47.05vw,calc(50vw - 5.589474dvh));top:min(19.791667vw,37.5dvh);width:min(52.95vw,calc(50vw + 5.589474dvh));height:auto;aspect-ratio:766.633/461.118}.campus-curve img{object-fit:contain;object-position:right top}.campus-logo{left:min(90.63vw,calc(50vw + 76.989474dvh));top:min(46.673611vw,88.42dvh);width:min(8.33vw,15.783158dvh);height:min(3.472222vw,6.578947dvh)}.campus-viewer{height:63.552632%;background:#fff}.campus-photo-controls{top:91.315789%}}
        @media(max-width:1023px){.campus-background{inset:auto;left:0;top:0;width:100%;aspect-ratio:1440/760}.campus-stage{width:100%;height:auto;aspect-ratio:1440/760}.campus-group-control{width:44px;height:44px}.campus-copy h1{font-size:3.4cqw}.campus-copy h1 span{font-size:4cqw}.campus-eyebrow p{font-size:1.25cqw}.campus-eyebrow span{width:3.4cqw;height:.5cqw}}
        @media(max-width:639px){
          .campus-stage{width:100%;height:820px;min-height:820px;aspect-ratio:auto;overflow:hidden}
          .campus-background{width:100%;height:820px;aspect-ratio:auto}.campus-background-image{object-position:center top}.campus-curve{left:25%;top:533px;width:92%;height:278.8px}.campus-logo{left:auto;right:18px;top:760px;bottom:auto;width:100px;height:42px}
          .campus-bar{left:12px;top:16px;width:calc(100% - 24px);height:156px;border-width:3px;border-radius:14px}.campus-toolbar{left:8px;top:24px;width:calc(100% - 58px);height:100px;gap:4px;align-items:center}
          .campus-area-button,.campus-technical-item{width:calc((100% - 16px)/5);min-width:44px;max-width:70px;flex:1 1 0;aspect-ratio:1}.campus-area-visual{border-width:3px}.campus-area-icon{padding:5%}.campus-tooltip{display:none}
          .campus-group-control{right:5px;width:44px;height:44px}.campus-group-control.is-previous{top:5px}.campus-group-control.is-next{bottom:5px}
          .campus-copy{left:24px;top:232px;width:calc(100% - 48px)}.campus-eyebrow{gap:8px}.campus-eyebrow span{width:40px;height:6px}.campus-eyebrow p{font-size:13px}.campus-copy h1{margin-top:13px;font-size:clamp(31px,10vw,40px);line-height:1.12}.campus-copy h1 span{font-size:inherit}
          .campus-viewer{left:12px;top:220px;width:calc(100% - 24px);height:350px;border-width:6px}.campus-photo-controls{left:50%;top:584px;width:164px;height:66px;transform:translateX(-50%)}
          .campus-technical-group{gap:4px;align-items:center}.campus-technical-item{animation-delay:calc(var(--item-index) * 10ms)}
        }
        @media(max-width:359px){.campus-toolbar{width:calc(100% - 54px);gap:2px}.campus-area-button,.campus-technical-item{min-width:44px}.campus-copy{left:18px;width:calc(100% - 36px)}.campus-viewer{left:8px;width:calc(100% - 16px)}}
        @media(prefers-reduced-motion:reduce){.campus *,.campus *:before,.campus *:after{scroll-behavior:auto!important}.campus-technical-item{animation-duration:20ms!important;animation-delay:0ms!important}.campus-copy,.campus-viewer,.campus-photo.is-incoming{transition-duration:20ms!important}.campus-invite-rings,.campus-invite-rings:before,.campus-invite-rings:after{display:none!important}}
      `}</style>
    </section>
  );
}
