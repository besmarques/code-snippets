import type { LanguageCatalog } from '../../../types';

import { JAVA_JDBC_COMMANDS } from './packages/jdbc';
import { JAVA_JPA_COMMANDS } from './packages/jpa';

export const JAVA_CATALOG: LanguageCatalog = {
  language: 'java',
  commands: [
    {
      keyword: 'main',
      description: 'Create a Java main entry point.',
      snippet: `public class \${1:Main} {
    public static void main(String[] args) {
        \${2:\${TM_SELECTED_TEXT:System.out.println("Hello, world!");}}
    }
}
\$0`,
    },
    {
      keyword: 'class',
      description: 'Create a Java class with a constructor and one field.',
      snippet: `public class \${1:Example} {
    private final \${2:String} \${3:name};

    public \${1}(\${2} \${3}) {
        this.\${3} = \${3};
    }
}
\$0`,
    },
    {
      keyword: 'interface',
      description: 'Create a Java interface.',
      snippet: `public interface \${1:ExampleService} {
    \${2:String} \${3:getName}();
}
\$0`,
    },
    {
      keyword: 'record',
      description: 'Create a Java record.',
      snippet: `public record \${1:User}(\${2:String} \${3:id}, \${4:String} \${5:name}) {
}
\$0`,
    },
    {
      keyword: 'enum',
      description: 'Create a Java enum.',
      snippet: `public enum \${1:Status} {
    \${2:IDLE},
    \${3:LOADING},
    \${4:SUCCESS},
    \${5:ERROR}
}
\$0`,
    },
    {
      keyword: 'list',
      description: 'Create a Java List.',
      snippet: `List<\${1:String}> \${2:items} = new ArrayList<>();
\$0`,
    },
    {
      keyword: 'map',
      description: 'Create a Java Map.',
      snippet: `Map<\${1:String}, \${2:Object}> \${3:values} = new HashMap<>();
\$0`,
    },
    {
      keyword: 'stream',
      description: 'Process a collection with the Java Stream API.',
      snippet: `List<\${1:String}> \${2:names} = \${3:items}.stream()
    .map(\${4:item} -> \${4}.getName())
    .toList();
\$0`,
    },
    {
      keyword: 'optional',
      description: 'Use Optional to safely transform a nullable value.',
      snippet: `Optional<\${1:String}> \${2:name} = Optional.ofNullable(\${3:user})
    .map(\${4:User}::getName);
\$0`,
    },
    {
      keyword: 'builder',
      description: 'Create a simple builder pattern.',
      snippet: `public class \${1:UserBuilder} {
    private \${2:String} \${3:name};

    public \${1} \${4:withName}(\${2} \${3}) {
        this.\${3} = \${3};
        return this;
    }

    public \${5:User} build() {
        return new \${5}(\${3});
    }
}
\$0`,
    },
    {
      keyword: 'loop',
      description: 'Loop through a list with an indexed for-loop.',
      snippet: `for (int \${1:i} = 0; \${1} < \${2:items}.size(); \${1}++) {
    \${3:Object} \${4:item} = \${2}.get(\${1});
    \${5:\${TM_SELECTED_TEXT:// ...}}
}
\$0`,
    },
    {
      keyword: 'foreach',
      description: 'Loop through a collection with an enhanced for-loop.',
      snippet: `for (\${1:String} \${2:item} : \${3:items}) {
    \${4:\${TM_SELECTED_TEXT:System.out.println(item);}}
}
\$0`,
    },
    {
      keyword: 'switch',
      description: 'Create a Java switch expression.',
      snippet: `String \${1:message} = switch (\${2:status}) {
    case \${3:IDLE} -> "\${4:Idle}";
    case \${5:SUCCESS} -> "\${6:Success}";
    default -> "\${7:Unknown}";
};
\$0`,
    },
    {
      keyword: 'trycatch',
      description: 'Wrap code in a Java try/catch block.',
      snippet: `try {
    \${1:riskyOperation}();
} catch (\${2:Exception} \${3:error}) {
    \${3}.printStackTrace();
}
\$0`,
    },
    {
      keyword: 'file',
      description: 'Read a file with the Java NIO API.',
      snippet: `Path \${1:path} = Path.of(\${2:"./data.txt"});
String \${3:content} = Files.readString(\${1});
\$0`,
    },
    {
      keyword: 'http',
      description: 'Send an HTTP GET request with Java HttpClient.',
      snippet: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create(\${1:"https://api.example.com/items"}))
    .GET()
    .build();

HttpClient client = HttpClient.newHttpClient();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
\$0`,
    },
    {
      keyword: 'fetch',
      description: 'Call an HTTP endpoint with Java HttpClient.',
      snippet: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create(\${1:"https://api.example.com/items"}))
    .GET()
    .build();

HttpClient client = HttpClient.newHttpClient();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

System.out.println(response.body());
\$0`,
    },
    ...JAVA_JDBC_COMMANDS,
    ...JAVA_JPA_COMMANDS,
  ],
};
