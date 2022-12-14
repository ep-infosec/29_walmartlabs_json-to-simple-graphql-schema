/**
 * Copyright (c) [2018]-present, Walmart Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License."
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const streamToApp = (inputStream) =>
  new Promise((resolve, reject) => {
    const appStream = spawn("node", ["app.js"], {
      cwd: path.join(__dirname, "../"),
    });

    let schemaResult = "";
    appStream.stdout.on("data", (data) => (schemaResult += data.toString()));
    appStream.stdout.on("close", () => resolve(schemaResult));

    inputStream.pipe(appStream.stdin).on("error", reject);
  });

const TEST_TIMEOUT = 60000;

describe("Integration tests", () => {
  it("Handles json input from stdin", async () => {
    jest.setTimeout(TEST_TIMEOUT);

    const schemaResult = await streamToApp(
      fs.createReadStream(path.join(__dirname, "/fixtures/complex.json"))
    );

    expect(schemaResult).toEqual(`type Extras {
  key: String
  value: String
}

type Groups {
  display_name: String
  description: String
  image_display_url: String
  title: String
  id: String
  name: String
}

type Tags {
  vocabulary_id: String
  state: String
  display_name: String
  id: String
  name: String
}

type Resources {
  mimetype: String
  cache_url: String
  hash: String
  description: String
  name: String
  format: String
  url: String
  datastore_active: Boolean
  cache_last_updated: String
  package_id: String
  created: String
  state: String
  mimetype_inner: String
  last_modified: String
  position: Int
  revision_id: String
  url_type: String
  id: String
  resource_type: String
  size: String
}

type Result {
  license_title: String
  maintainer: String
  private: Boolean
  maintainer_email: String
  num_tags: Int
  id: String
  metadata_created: String
  metadata_modified: String
  author: String
  author_email: String
  state: String
  version: String
  creator_user_id: String
  type: String
  num_resources: Int
  license_id: String
  organization: String
  name: String
  isopen: Boolean
  url: String
  notes: String
  owner_org: String
  license_url: String
  title: String
  revision_id: String
  extras: [Extras]
  relationships_as_subject: [String]
  groups: [Groups]
  tags: [Tags]
  resources: [Resources]
  relationships_as_object: [String]
}

type AutogeneratedMainType {
  help: String
  success: Boolean
  result: Result
}
`);
  });
});
