import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("fire.getData", () => {
  it("returns GeoJSON with fire hotspots", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.fire.getData();

    expect(result).toBeDefined();
    expect(result.type).toBe("FeatureCollection");
    expect(result.features).toBeInstanceOf(Array);
    expect(result.features.length).toBeGreaterThan(0);
  });

  it("each feature has required properties", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.fire.getData();
    const feature = result.features[0];

    expect(feature.type).toBe("Feature");
    expect(feature.geometry.type).toBe("Point");
    expect(feature.geometry.coordinates).toBeInstanceOf(Array);
    expect(feature.geometry.coordinates.length).toBe(2);
    expect(feature.properties).toBeDefined();
    expect(feature.properties.brightness).toBeGreaterThan(0);
    expect(feature.properties.frp).toBeGreaterThan(0);
  });

  it("coordinates are within Paradise, CA area", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.fire.getData();
    const feature = result.features[0];
    const [lon, lat] = feature.geometry.coordinates;

    // Paradise, CA is around 39.76°N, 121.62°W
    expect(lat).toBeGreaterThan(39.5);
    expect(lat).toBeLessThan(40.0);
    expect(lon).toBeGreaterThan(-122.0);
    expect(lon).toBeLessThan(-121.0);
  });
});
